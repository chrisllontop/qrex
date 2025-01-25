import type { BitBuffer } from "../core/bit-buffer";
import type { BitMatrix } from "../core/bit-matrix";

export type RendererType = "canvas" | "svg" | "terminal" | "txt" | "utf8" | "png";

export type RenderOptions = {
  width?: number; // Minimum 21
  scale?: number; // Default: 4
  margin?: number; // Default: 4
  color?: {
    dark?: string; // Hex color, default: "#000000ff"
    light?: string; // Hex color, default: "#ffffffff"
  };
  renderConfig?: RenderConfig;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RenderConfig = Record<string, any>;

export type QrexOptions = {
  /** Output type */
  type?: RendererType;
  /** QR Code version */
  version?: number;
  /** Error correction level */
  errorCorrectionLevel?: ErrorCorrectionLevel;
  /** Mask pattern */
  maskPattern?: MaskPatternType;
  toSJISFunc?: (text: string) => number | undefined;
  render?: RenderOptions;
};

export type ProcessedRenderOptions = {
  width?: number;
  scale: number;
  margin: number;
  color: {
    dark: ColorObject;
    light: ColorObject;
  };
  type?: RendererType;
  renderConfig: RenderConfig;
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

export type ModeType = "alphanumeric" | "byte" | "kanji" | "numeric" | "mixed";

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

export type Segment = SegmentInterface | SegmentInterface<Uint8Array>;

export interface SegmentInterface<T = string> {
  data: T;
  index?: number;
  mode: DataMode;
  length: number;
  getBitsLength?(): number;
  getLength?(): number;
  write?(bitBuffer: BitBuffer): void;
}

export type RenderFunctionBase<T> = (data: QRData, opts?: RenderOptions) => T;

export type ColorObject = {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
};
