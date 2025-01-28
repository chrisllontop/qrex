import type { BitBuffer } from "../core/bit-buffer";
import type { BitMatrix } from "../core/bit-matrix";

/** Available renderer types for QR code output */
export type RendererType = "canvas" | "svg" | "terminal" | "txt" | "utf8" | "png";

/** Options for QR codes rendering */
export type RenderOptions = {
  /** Width of the QR code in pixels (minimum: 21) */
  width?: number;
  /** Scale factor for the QR code (default: 4) */
  scale?: number;
  /** Margin around the QR code in modules (default: 4) */
  margin?: number;
  /** Color configuration for QR code */
  color?: {
    /** Color for the dark modules (hex color, default: "#000000ff") */
    dark?: string;
    /** Color for the light modules (hex color, default: "#ffffffff") */
    light?: string;
  };
  /** Additional renderer-specific configuration */
  renderConfig?: RenderConfig;
};

/** Additional renderer-specific configuration options */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RenderConfig = Record<string, any>;

/** Main configuration options for QR code generation */
export type QrexOptions = {
  /** Output renderer type */
  type?: RendererType;
  /** QR Code version (1-40) */
  version?: number;
  /** Error correction level (L, M, Q, H) */
  errorCorrectionLevel?: ErrorCorrectionLevel;
  /** Mask pattern (0-7) */
  maskPattern?: MaskPatternType;
  /** Function to convert text to Shift JIS encoding */
  toSJISFunc?: (text: string) => number | undefined;
  /** Rendering options for QR code output */
  render?: RenderOptions;
};

/** Processed and normalized rendering options with defaults applied */
export type ProcessedRenderOptions = {
  /** Final width of the QR code */
  width?: number;
  /** Final scale factor */
  scale: number;
  /** Final margin size */
  margin: number;
  /** Processed color configuration */
  color: {
    /** Dark module color as RGB object */
    dark: ColorObject;
    /** Light module color as RGB object */
    light: ColorObject;
  };
  /** Selected renderer type */
  type?: RendererType;
  /** Final renderer configuration */
  renderConfig: RenderConfig;
};

/** Content string for QR code generation */
export type QrContent = string;

/** Internal QR code data structure */
export type QRData = {
  /** Binary matrix representing QR code modules */
  modules: BitMatrix;
  /** QR code version number */
  version: number;
  /** Error correction level configuration */
  errorCorrectionLevel: ErrorCorrectionLevelBit;
  /** Selected mask pattern */
  maskPattern: MaskPatternType;
  /** Data segments contained in the QR code */
  segments: Segment[];
};

/** Internal representation of error correction level */
export type ErrorCorrectionLevelBit = {
  /** Bit value representing error correction level */
  bit: number;
};

/** String representation of error correction levels */
export type ErrorCorrectionLevelString = "L" | "M" | "Q" | "H" | "low" | "medium" | "quartile" | "high";

/** Combined type for error correction level specification */
export type ErrorCorrectionLevel = ErrorCorrectionLevelBit | ErrorCorrectionLevelString;

/** Valid mask pattern values (0-7) */
export type MaskPatternType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Available encoding modes for QR code data */
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

/** Data segment type for QR code content */
export type Segment = SegmentInterface | SegmentInterface<Uint8Array>;

/** Interface for QR code data segments */
export interface SegmentInterface<T = string> {
  /** Segment data content */
  data: T;
  /** Position index in the data stream */
  index?: number;
  /** Encoding mode for this segment */
  mode: DataMode;
  /** Length of the segment data */
  length: number;
  /** Get the length of the segment in bits */
  getBitsLength?(): number;
  /** Get the length of the segment in characters */
  getLength?(): number;
  /** Write segment data to the bit buffer */
  write?(bitBuffer: BitBuffer): void;
}

/** Base type for renderer functions */
export type RenderFunctionBase<T> = (data: QRData, opts?: RenderOptions) => T;

/** Color representation object */
export type ColorObject = {
  /** Red component (0-255) */
  r: number;
  /** Green component (0-255) */
  g: number;
  /** Blue component (0-255) */
  b: number;
  /** Alpha component (0-255) */
  a: number;
  /** Hexadecimal color string */
  hex: string;
};
