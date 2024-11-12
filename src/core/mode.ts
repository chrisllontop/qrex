import { Regex } from "./regex";
import { VersionCheck } from "./version-check";

const NUMERIC = {
  id: "Numeric",
  bit: 1 << 0,
  ccBits: [10, 12, 14],
};

const ALPHANUMERIC = {
  id: "Alphanumeric",
  bit: 1 << 1,
  ccBits: [9, 11, 13],
};

const BYTE = {
  id: "Byte",
  bit: 1 << 2,
  ccBits: [8, 16, 16],
};

const KANJI = {
  id: "Kanji",
  bit: 1 << 3,
  ccBits: [8, 10, 12],
};

const MIXED = {
  bit: -1,
};

/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */
function getCharCountIndicator(mode, version) {
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
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */
function getBestModeForData(dataStr) {
  if (Regex.testNumeric(dataStr)) return NUMERIC;
  if (Regex.testAlphanumeric(dataStr)) return ALPHANUMERIC;
  if (Regex.testKanji(dataStr)) return KANJI;
  return BYTE;
}

/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */
function toString(mode) {
  if (mode?.id) return mode.id;
  throw new Error("Invalid mode");
}

/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */
function isValid(mode) {
  return mode?.bit && mode.ccBits;
}

/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */
function fromString(string) {
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
 *
 * @param  {Mode|String} value        Encoding mode
 * @param  {Mode}        defaultValue Fallback value
 * @return {Mode}                     Encoding mode
 */
function from(value, defaultValue) {
  if (isValid(value)) {
    return value;
  }

  try {
    return fromString(value);
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
