import type { DataMode, ModeType } from "../types/qrex.type";
import { Regex } from "./regex";
import { VersionCheck } from "./version-check";

const NUMERIC: DataMode = {
  id: "numeric",
  bit: 1 << 0,
  ccBits: [10, 12, 14],
};

const ALPHANUMERIC: DataMode = {
  id: "alphanumeric",
  bit: 1 << 1,
  ccBits: [9, 11, 13],
};

const BYTE: DataMode = {
  id: "byte",
  bit: 1 << 2,
  ccBits: [8, 16, 16],
};

const KANJI: DataMode = {
  id: "kanji",
  bit: 1 << 3,
  ccBits: [8, 10, 12],
};

const MIXED = {
  bit: -1,
};

/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 */
function getCharCountIndicator(mode: DataMode, version: number): number {
  if (!mode.ccBits) throw new Error(`Invalid mode: ${mode}`);

  if (!VersionCheck.isValid(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  if (version >= 1 && version < 10) return mode.ccBits[0];
  if (version < 27) return mode.ccBits[1];
  return mode.ccBits[2];
}

/**
 * Returns the most efficient mode to store the specified data
 */
function getBestModeForData(dataStr: string) {
  if (Regex.testNumeric(dataStr)) return NUMERIC;
  if (Regex.testAlphanumeric(dataStr)) return ALPHANUMERIC;
  if (Regex.testKanji(dataStr)) return KANJI;
  return BYTE;
}

/**
 * Return mode name as string
 */
function toString(mode: DataMode) {
  if (mode?.id) return mode.id;
  throw new Error("Invalid mode");
}

/**
 * Check if input param is a valid mode object
 */
function isValid(mode: DataMode) {
  return Boolean(mode?.bit && mode.ccBits);
}

/**
 * Get mode object from its name
 *
 */
function fromString(string: ModeType): DataMode {
  if (typeof string !== "string") {
    throw new Error("Param is not a string");
  }

  const lcStr = string.toLowerCase();

  switch (lcStr) {
    case "numeric":
      return NUMERIC;
    case "alphanumeric":
      return ALPHANUMERIC;
    case "kanji":
      return KANJI;
    case "byte":
      return BYTE;
    default:
      throw new Error(`Unknown mode: ${string}`);
  }
}

/**
 * Returns mode from a value.
 * If value is not a valid mode, returns defaultValue
 */
function from(value: ModeType | DataMode, defaultValue: DataMode): DataMode {
  try {
    if (typeof value === "string") {
      return fromString(value);
    }
    if (isValid(value)) {
      return value;
    }
    throw new Error("Invalid mode");
  } catch (e) {
    return defaultValue;
  }
}

export const Mode = {
  NUMERIC,
  ALPHANUMERIC,
  BYTE,
  KANJI,
  MIXED,
  getCharCountIndicator,
  getBestModeForData,
  toString,
  isValid,
  from,
};
