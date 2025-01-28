import type { BitBuffer } from "../core/bit-buffer";
import type { BitMatrix } from "../core/bit-matrix";

/**
 * Available renderer types for QR code output.
 * Supports multiple output formats including HTML5 Canvas, SVG, terminal output, and more.
 */
export type RendererType = "canvas" | "svg" | "terminal" | "txt" | "utf8" | "png";

/**
 * Options for rendering QR codes.
 * Controls the visual appearance and output format of the generated QR code,
 * including size, colors, margins, and renderer-specific configs.
 */
export type RenderOptions = {
  /** Width of the QR code in pixels (minimum: 21) */
  width?: number;
  /** Scale factor for the QR code (default: 4) */
  scale?: number;
  /** Margin around the QR code in modules (default: 4) */
  margin?: number;
  /** Color config for QR code */
  color?: {
    /** Color for the dark modules (hex color, default: "#000000ff") */
    dark?: string;
    /** Color for the light modules (hex color, default: "#ffffffff") */
    light?: string;
  };
  /** Additional renderer-specific config */
  renderConfig?: RenderConfig;
};

/** Additional renderer-specific config options */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RenderConfig = Record<string, any>;

/**
 * Main config options for QR code generation.
 * Defines all aspects of the QR code including version, error correction,
 * masking pattern, and rendering options. These settings determine the
 * QR code's capacity, reliability, and visual appearance.
 */
export type QrexOptions = {
  /** Output renderer type */
  type?: RendererType;
  /** QR Code version (1-40) controlling the size and data capacity */
  version?: number;
  /** Error correction level (L: 7%, M: 15%, Q: 25%, H: 30% recovery capacity) */
  errorCorrectionLevel?: ErrorCorrectionLevel;
  /** Mask pattern (0-7) for optimal module arrangement */
  maskPattern?: MaskPatternType;
  /** Function to convert text to Shift JIS encoding for Kanji mode */
  toSJISFunc?: (text: string) => number | undefined;
  /** Rendering options for QR code output */
  render?: RenderOptions;
};

/**
 * Processed and normalized rendering options with defaults applied.
 * Contains the final config values used for rendering after
 * merging user options with defaults and processing color values.
 */
export type ProcessedRenderOptions = {
  /** Final width of the QR code */
  width?: number;
  /** Final scale factor */
  scale: number;
  /** Final margin size */
  margin: number;
  /** Processed color config */
  color: {
    /** Dark module color as RGB object */
    dark: ColorObject;
    /** Light module color as RGB object */
    light: ColorObject;
  };
  /** Selected renderer type */
  type?: RendererType;
  /** Additional renderer-specific config */
  renderConfig: RenderConfig;
};

/** Content string for QR code generation */
export type QrContent = string;

/**
 * Internal QR code data structure.
 * Represents the complete QR code matrix and its config,
 * including the binary data matrix, version, error correction,
 * mask pattern, and encoded data segments.
 */
export type QRData = {
  /** Binary matrix representing QR code modules */
  modules: BitMatrix;
  /** QR code version number */
  version: number;
  /** Error correction level config */
  errorCorrectionLevel: ErrorCorrectionLevelBit;
  /** Selected mask pattern */
  maskPattern: MaskPatternType;
  /** Data segments contained in the QR code */
  segments: Segment[];
};

/**
 * Internal representation of error correction level.
 * Used for encoding the error correction level in the QR code format information.
 */
export type ErrorCorrectionLevelBit = {
  /** Bit value representing error correction level */
  bit: number;
};

/**
 * String representation of error correction levels.
 * Supports both short (L,M,Q,H) and descriptive names for error correction levels.
 */
export type ErrorCorrectionLevelString = "L" | "M" | "Q" | "H" | "low" | "medium" | "quartile" | "high";

/** Combined type for error correction level specification */
export type ErrorCorrectionLevel = ErrorCorrectionLevelBit | ErrorCorrectionLevelString;

/** Valid mask pattern values (0-7) */
export type MaskPatternType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Available encoding modes for QR code data.
 * Different modes optimize encoding for specific types of content:
 * - numeric: digits only
 * - alphanumeric: digits and uppercase letters
 * - byte: 8-bit data
 * - kanji: Shift JIS characters
 * - mixed: automatic mode selection
 */
export type ModeType = "alphanumeric" | "byte" | "kanji" | "numeric" | "mixed";

/**
 * Mode Object.
 * Contains encoding specifications for different QR code data modes,
 * including mode identifier and character count indicator lengths.
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

/**
 * Interface for QR code data segments.
 * Defines the structure for encoded data segments within the QR code,
 * supporting different data types and encoding modes.
 */
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

/**
 * Color representation object.
 * Provides both RGB and hexadecimal representations of colors
 * for flexible color handling across different renderers.
 */
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
