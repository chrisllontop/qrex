import type { PNGOptions } from "pngjs";
import type { BitBuffer } from "../core/bit-buffer";

type ModeType = "Alphanumeric" | "Byte" | "Kanji" | "Numeric";
export interface DataMode {
  id?: ModeType;
  bit: number;
  ccBits?: number[];
}

export type ErrorCorrectionLevelBit = {
  bit: number;
};

export type MaskPatternType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ErrorCorrectionLevelString = "L" | "M" | "Q" | "H" | "low" | "medium" | "quartile" | "high";

export type ErrorCorrectionLevel = ErrorCorrectionLevelBit | ErrorCorrectionLevelString;

export type Segment = SegmentInterface | SegmentInterface<Uint8Array>;

export interface SegmentInterface<T = string> {
  data: T;
  index?: number;
  mode: DataMode | string;
  length: number;
  getBitsLength?(): number;
  getLength?(): number;
  write?(bitBuffer: BitBuffer): void;
}

export type RendererType = "canvas" | "svg" | "terminal" | "txt" | "utf8" | "png";

export type QRexOptions = {
  type?: RendererType;
  version?: number;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  maskPattern?: MaskPatternType;
  toSJISFunc?: (text: string) => number;
};

export type QrContent = string;

export interface QRData {
  modules: {
    size: number;
    data: boolean[] | boolean[][] | Uint8Array;
  };
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
}

export interface ColorOptions {
  dark?: string;
  light?: string;
}

export interface Color {
  hex: string;
  a: number;
}

export interface RendererOptions {
  quality?: number;
}

export interface RenderOptions extends QRexOptions {
  margin?: number;
  width?: number;
  scale?: number;
  small?: boolean;
  inverse?: boolean;
  rendererOpts?: PNGOptions | { quality?: number };
  [key: string]: unknown;
}
export type RenderFunc = (data: QRData, canvas?: HTMLCanvasElement, opts?: RenderOptions) => unknown;
export type RenderFuncServer = (data: QRData, opts?: RenderOptions, cb?: Callback) => undefined | unknown;
export type Callback = (err: Error | NodeJS.ErrnoException | null, output?: string | null) => void;

export interface GraphTableEntry {
  node: SegmentInterface;
  lastCount: number;
}

export interface Graph {
  map: Record<string, Record<string, number>>;
  table: Record<string, GraphTableEntry>;
}
