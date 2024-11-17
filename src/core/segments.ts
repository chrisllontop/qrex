import type { Mode, ModeId } from "qrcode";

import * as dijk from "dijkstrajs";
import { NUMERIC, ALPHANUMERIC, BYTE, KANJI, getCharCountIndicator, getBestModeForData, from, toString } from "./mode.js";
import { isKanjiModeEnabled } from './utils.js'
import { AlphanumericData } from "./alphanumeric-data.js";
import { ByteData } from "./byte-data.js";
import { KanjiData } from "./kanji-data.js";
import NumericData from "./numeric-data.js";
import {
  NUMERIC as _NUMERIC,
  ALPHANUMERIC as _ALPHANUMERIC,
  BYTE as _BYTE,
  KANJI as _KANJI,
  BYTE_KANJI
} from "./regex.js";

export type Segment = {
  data: any;
  length?: any;
  index?: number;
  mode: Mode<ModeId>;
}

export type Node = {
  end?: number;
  node: Segment;
  lastCount: number;
}

export type NodeGraph = {
  start: Node;
  [key: string]: Node;
}

export type Graph = {
  map: NodeGraph;
  table: Record<string, Node>;
}

/**
 * Returns UTF8 byte length
 *
 * @param  {String} str Input string
 * @return {Number}     Number of byte
 */
function getStringByteLength(value: string): number {
  return unescape(encodeURIComponent(value)).length;
}

/**
 * Get a list of segments of the specified mode
 * from a string
 *
 * @param regex
 * @param  {Mode}   mode Segment mode
 * @param  {String} str  String to process
 * @return {Array}       Array of object with segments data
 */
function getSegments(regex, mode: Mode, value: string): Segment[] {
  let result: Segment;
  const segments: Segment[] = [];

  while ((result = regex.exec(value)) !== null) {
    segments.push({
      data: result[0],
      index: result.index,
      mode: mode,
      length: result[0].length,
    });
  }

  return segments;
}

/**
 * Extracts a series of segments with the appropriate
 * modes from a string
 *
 * @param  {String} dataStr Input string
 * @return {Array}          Array of object with segments data
 */
function getSegmentsFromString(value: string): Segment[] {
  const numSegs = getSegments(_NUMERIC, NUMERIC, value);
  const alphaNumSegs = getSegments(
    _ALPHANUMERIC,
    ALPHANUMERIC,
    value,
  );
  let byteSegs;
  let kanjiSegs;

  if (isKanjiModeEnabled()) {
    byteSegs = getSegments(_BYTE, BYTE, value);
    kanjiSegs = getSegments(_KANJI, KANJI, value);
  } else {
    byteSegs = getSegments(BYTE_KANJI, BYTE, value);
    kanjiSegs = [];
  }

  const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

  return segs
    .sort((s1, s2) => s1.index - s2.index)
    .map((obj) => ({
      data: obj.data,
      mode: obj.mode,
      length: obj.length,
    }));
}

/**
 * Returns how many bits are needed to encode a string of
 * specified length with the specified mode
 *
 * @param  {Number} length String length
 * @param  {Mode} mode     Segment mode
 * @return {Number}        Bit length
 */
function getSegmentBitsLength(length: number, mode: Mode): number {
  switch (mode) {
    case NUMERIC:
      return NumericData.getBitsLength(length);
    case ALPHANUMERIC:
      return AlphanumericData.getBitsLength(length);
    case KANJI:
      return KanjiData.getBitsLength(length);
    case BYTE:
      return ByteData.getBitsLength(length);
  }
}

/**
 * Merges adjacent segments which have the same mode
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function mergeSegments(segs: Segment[]): Segment[] {
  return segs.reduce((acc, curr) => {
    const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
    if (prevSeg && prevSeg.mode === curr.mode) {
      acc[acc.length - 1].data += curr.data;
      return acc;
    }

    acc.push(curr);
    return acc;
  }, [])
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
 *
 * @param  {Array} segs Array of object with segments data
 * @return {Array}      Array of object with segments data
 */
function buildNodes(segs: Segment[]): Segment[] {
  const nodes = [];
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];

    if (typeof seg.data !== 'string') {
      seg.data = seg.data.toString();
    }

    switch (seg.mode) {
      case Mode.NUMERIC:
        nodes.push([
          seg,
          { data: seg.data, mode: ALPHANUMERIC, length: seg.length },
          { data: seg.data, mode: BYTE, length: seg.length },
        ]);
        break;
      case ALPHANUMERIC:
        nodes.push([
          seg,
          { data: seg.data, mode: BYTE, length: seg.length },
        ]);
        break;
      case KANJI:
        nodes.push([
          seg,
          {
            data: seg.data,
            mode: Mode.BYTE,
            length: getStringByteLength(seg.data),
          },
        ]);
        break;
      case BYTE:
        nodes.push([
          {
            data: seg.data,
            mode: Mode.BYTE,
            length: getStringByteLength(seg.data),
          },
        ]);
    }
  }

  return nodes;
}

/**
 * Builds a graph from a list of nodes.
 * All segments in each node group will be connected with all the segments of
 * the next group and so on.
 *
 * At each connection will be assigned a weight depending on the
 * segment's byte length.
 *
 * @param  {Array} nodes    Array of object with segments data
 * @param  {Number} version QR Code version
 * @return {Object}         Graph of all possible segments
 */
function buildGraph(nodes: Segment[], version: number): Graph {
  const table = {};
  const graph = { start: {} as Node };

  let prevNodeIds = ['start'];

  for (let i = 0; i < nodes.length; i++) {
    const nodeGroup = nodes[i];
    const currentNodeIds = [];

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
            getSegmentBitsLength(
              table[prevNodeId].lastCount + node.length,
              node.mode,
            ) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

          table[prevNodeId].lastCount += node.length;
        } else {
          if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

          graph[prevNodeId][key] =
            getSegmentBitsLength(node.length, node.mode) +
            4 +
            getCharCountIndicator(node.mode, version); // switch cost
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
 *
 * @param  {String} data             Input data
 * @param  {Mode | String} modesHint Data mode
 * @return {Segment}                 Segment
 */
function buildSingleSegment(data: string, modesHint: Mode | string): Segment {
  let mode;
  const bestMode = getBestModeForData(data);

  mode = from(modesHint, bestMode);

  // Make sure data can be encoded
  if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
    throw new Error(
      `"${data}" cannot be encoded with mode ${toString(mode)}.
 Suggested mode is: ${toString(bestMode)}`,
    );
  }

  // Use Mode.BYTE if Kanji support is disabled
  if (mode === KANJI && !isKanjiModeEnabled()) {
    mode = BYTE;
  }

  switch (mode) {
    case NUMERIC:
      return new NumericData(data);
    case ALPHANUMERIC:
      return new AlphanumericData(data);
    case KANJI:
      return new KanjiData(data);
    case BYTE:
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
 *
 * @param  {Array} array Array of objects with segments data
 * @return {Array}       Array of Segments
 */
export function fromArray(array: Segment[] | number[]): Segment[] {
  return array.reduce((acc: Segment[], seg: Segment) => {
    if (typeof seg === 'string') {
      acc.push(buildSingleSegment(seg, null));
    } else if (seg.data) {
      if (typeof seg.data !== 'string') {
        seg.data = seg.data.toString();
      }

      acc.push(buildSingleSegment(seg.data, seg.mode));
    }

    return acc;
  }, [])
}

/**
 * Builds an optimized sequence of segments from a string,
 * which will produce the shortest possible bitstream.
 *
 * @param  {String} data    Input string
 * @param  {Number} version QR Code version
 * @return {Array}          Array of segments
 */
export function fromString(data: string, version: number): Segment[] {
  const segs = getSegmentsFromString(data);

  const nodes = buildNodes(segs);
  const graph = buildGraph(nodes, version);
  const path = find_path(graph.map, 'start', 'end');

  const optimizedSegs = [];
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
 *
 * @param  {string} data Input string
 * @return {Array}       Array of segments
 */
export function rawSplit(data: string): Segment[] {
  return fromArray(getSegmentsFromString(data));
}

export const Segments = {
  fromArray,
  fromString,
  rawSplit,
};
