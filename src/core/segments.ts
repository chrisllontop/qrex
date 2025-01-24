import { find_path } from "dijkstrajs";
import type { DataMode, ModeType, Segment, SegmentInterface } from "../types/qrex.type";
import { AlphanumericData } from "./alphanumeric-data";
import { ByteData } from "./byte-data";
import { KanjiData } from "./kanji-data";
import { Mode } from "./mode";
import NumericData from "./numeric-data";
import { Regex } from "./regex";
import { CoreUtils } from "./utils";

/**
 * Returns UTF8 byte length
 */
function getStringByteLength(str: string): number {
  return unescape(encodeURIComponent(str)).length;
}

/**
 * Get a list of segments of the specified mode
 * from a string
 */
function getSegments(regex: RegExp, mode: DataMode, str: string): Segment[] {
  const segments: Segment[] = [];
  let result: RegExpExecArray | null;

  while ((result = regex.exec(str)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length,
    } as Segment);
  }

  return segments;
}

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 */
function getSegmentsFromString(dataStr: string): Segment[] {
  const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
  const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
  let byteSegs: Segment[];
  let kanjiSegs: Segment[];

  if (CoreUtils.isKanjiModeEnabled()) {
    byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
    kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
  } else {
    byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
    kanjiSegs = [];
  }

  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

  return segs.sort((s1, s2) => s1.index! - s2.index!);
}

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 */
function getSegmentBitsLength(length: number, mode: DataMode): number | undefined {
  switch (mode) {
    case Mode.NUMERIC:
      return NumericData.getBitsLength(length);
    case Mode.ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length);
    case Mode.KANJI:
      return KanjiData.getBitsLength(length);
    case Mode.BYTE:
      return ByteData.getBitsLength(length);
  }
}

/**
 * Merges adjacent segments which have the same mode
 */
function mergeSegments(segs: Segment[]): Segment[] {
  return segs.reduce((acc: Segment[], curr: Segment) => {
    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1].data = acc[acc.length - 1].data.toString() + curr.data.toString();
      return acc;
    }

    acc.push(curr);
    return acc;
  }, []);
}

/**
 * Generates a list of all possible nodes combination which
 * will be used to build a segments graph.
 *
 * Nodes are divided by groups. Each group will contain a list of all the modes
 * in which is possible to encode the given text.
 *
 * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
 * The group for '12345' will contain then 3 objects, one for each
 * possible encoding mode.
 *
 * Each node represents a possible segment.
 */
function buildNodes(segs: Segment[]): Segment[][] {
  const nodes: Segment[][] = [];
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    const segData = seg.data.toString();

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([
          seg,
          { data: segData, mode: Mode.ALPHANUMERIC, length: seg.length } as Segment,
          { data: segData, mode: Mode.BYTE, length: seg.length } as Segment,
        ]);
        break;
      case Mode.ALPHANUMERIC:
        nodes.push([seg, { data: segData, mode: Mode.BYTE, length: seg.length } as Segment]);
        break;
      case Mode.KANJI:
        nodes.push([
          seg,
          {
            data: segData,
            mode: Mode.BYTE,
            length: getStringByteLength(segData),
          } as Segment,
        ]);
        break;
      case Mode.BYTE:
        nodes.push([
          {
            data: segData,
            mode: Mode.BYTE,
            length: getStringByteLength(segData),
          } as Segment,
        ]);
    }
  }

  return nodes;
}

interface GraphNode {
  node: Segment;
  lastCount: number;
}

interface GraphResult {
  map: { [key: string]: { [key: string]: number } };
  table: { [key: string]: GraphNode };
}

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 */
function buildGraph(nodes: Segment[][], version: number): GraphResult {
  const table: { [key: string]: GraphNode } = {};
  const graph: { [key: string]: { [key: string]: number } } = { start: {} };
  let prevNodeIds: string[] = ["start"];

  for (let i = 0; i < nodes.length; i++) {
    const nodeGroup = nodes[i];
    const currentNodeIds: string[] = [];

    for (let j = 0; j < nodeGroup.length; j++) {
      const node = nodeGroup[j];
      const key = `${i}${j}`;

      currentNodeIds.push(key);
      table[key] = { node: node, lastCount: 0 };
      graph[key] = {};

      for (let n = 0; n < prevNodeIds.length; n++) {
        const prevNodeId = prevNodeIds[n];

        if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
          graph[prevNodeId][key] =
            getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode)! -
            getSegmentBitsLength(table[prevNodeId].lastCount, node.mode)!;

          table[prevNodeId].lastCount += node.length;
        } else {
          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

          graph[prevNodeId][key] =
            getSegmentBitsLength(node.length, node.mode)! + 4 + Mode.getCharCountIndicator(node.mode, version); // switch cost
        }
      }
    }

    prevNodeIds = currentNodeIds;
  }

  for (let n = 0; n < prevNodeIds.length; n++) {
    graph[prevNodeIds[n]].end = 0;
  }

  return { map: graph, table: table };
}

/**
 * Builds a segment from a specified data and mode.
 * If a mode is not specified, the more suitable will be used.
 */
function buildSingleSegment(data: string, modesHint?: DataMode | ModeType): Segment | undefined {
  let mode: DataMode | undefined;
  const bestMode = Mode.getBestModeForData(data);

  mode = Mode.from(modesHint, bestMode);

  // Make sure data can be encoded
  if (mode !== Mode.BYTE && mode && mode.bit < bestMode.bit) {
    throw new Error(
      `"${data}" cannot be encoded with mode ${Mode.toString(mode)}.
 Suggested mode is: ${Mode.toString(bestMode)}`,
    );
  }

  // Use Mode.BYTE if Kanji support is disabled
  if (mode === Mode.KANJI && !CoreUtils.isKanjiModeEnabled()) {
    mode = Mode.BYTE;
  }

  switch (mode) {
    case Mode.NUMERIC:
      return new NumericData(data);

    case Mode.ALPHANUMERIC:
      return new AlphanumericData(data);

    case Mode.KANJI:
      return new KanjiData(data);

    case Mode.BYTE:
      return new ByteData(data);
  }
}

/**
 * Builds a list of segments from an array.
 * Array can contain Strings or Objects with segment's info.
 *
 * For each item which is a string, will be generated a segment with the given
 * string and the more appropriate encoding mode.
 *
 * For each item which is an object, will be generated a segment with the given
 * data and mode.
 * Objects must contain at least the property "data".
 * If property "mode" is not present, the more suitable mode will be used.
 */
function fromArray(array: (Segment | string)[]): Segment[] {
  return array.reduce((acc: Segment[], seg) => {
    if (typeof seg === "string") {
      acc.push(buildSingleSegment(seg as string, undefined)!);
    } else if (seg.data) {
      acc.push(buildSingleSegment(seg.data as string, seg.mode)!);
    }
    return acc;
  }, []);
}

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 */
function fromString(data: string, version: number): Segment[] {
  const segs = getSegmentsFromString(data);
  const nodes = buildNodes(segs);
  const graph = buildGraph(nodes, version);
  const path = find_path(graph.map, "start", "end");

  const optimizedSegs: Segment[] = [];
  for (let i = 1; i < path.length - 1; i++) {
    optimizedSegs.push(graph.table[path[i]].node);
  }

  return fromArray(mergeSegments(optimizedSegs));
}

/**
 * Splits a string in various segments with the modes which
 * best represent their content.
 * The produced segments are far from being optimized.
 * The output of this function is only used to estimate a QR Code version
 * which may contain the data.
 */
function rawSplit(data: string): Segment[] {
  return fromArray(getSegmentsFromString(data));
}

export const Segments = {
  fromArray,
  fromString,
  rawSplit,
};
