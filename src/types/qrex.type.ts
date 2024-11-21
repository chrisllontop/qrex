import type { BitMatrix } from "../core/bit-matrix";

export type RendererType = "canvas" | "svg" | "terminal" | "txt" | "utf8" | "png";

/**
 * QR Code options
 */
export type QRexOptions = {
  /** Output type */
  type: RendererType;
  /** QR Code version */
  version: number;
  /** Error correction level */
  errorCorrectionLevel: ErrorCorrectionLevelString;
  /** Mask pattern */
  maskPattern: MaskPatternType;
  toSJISFunc: (text: string) => Uint8Array;
};

export type QrContent = string;

export type QRData = {
  modules: BitMatrix;
  version: number;
  errorCorrectionLevel: ErrorCorrectionLevelBit;
  maskPattern: MaskPatternType;
  segments: Segment[];
};

export type ErrorCorrectionLevelBit = {
  bit: number;
};

export type ErrorCorrectionLevelString = "L" | "M" | "Q" | "H" | "low" | "medium" | "quartile" | "high";

export type ErrorCorrectionLevel = ErrorCorrectionLevelBit | ErrorCorrectionLevelString;

export type MaskPatternType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ModeType = "alphanumeric" | "byte" | "kanji" | "numeric";

/**
 * Mode Object
 */
export type DataMode = {
  /** Model type */
  id: ModeType;
  /** Number of bits for the mode indicator */
  bit: number;
  /** Number of bits for the character count indicator */
  ccBits: [number, number, number];
};

export type Segment = {
  data: string;
  index: number;
  mode: DataMode;
  length: number;
};

export type RenderFunctionBase<T> = (data: QRData, opts?: QRexOptions) => T;
