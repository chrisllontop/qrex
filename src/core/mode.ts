import type { Mode as ModeType } from "qrcode";

import { isValid as _isValid } from "./version-check.js";
import { testNumeric, testAlphanumeric, testKanji } from "./regex.js";

const BITS_NUMERIC: Readonly<number[]> = [10, 12, 14];
const BITS_BYTE: Readonly<number[]> = [8, 16, 16];
const BITS_KANJI: Readonly<number[]> = [8, 10, 12];
const BITS_ALPHANUMERIC: Readonly<number[]> = [9, 11, 13];
const BITS_MIXED: Readonly<number[]> = [];

export const NUMERIC: ModeType = {
  id: 'Numeric',
  bit: 1 << 0,
  ccBits: BITS_NUMERIC
};

export const ALPHANUMERIC: ModeType = {
  id: 'Alphanumeric',
  bit: 1 << 1,
  ccBits: BITS_ALPHANUMERIC
};

export const BYTE: ModeType = {
  id: 'Byte',
  bit: 1 << 2,
  ccBits: BITS_BYTE
};

export const KANJI: ModeType = {
  id: 'Kanji',
  bit: 1 << 3,
  ccBits: BITS_KANJI
};

export const MIXED: ModeType = {
  id: 'Byte',
  bit: -1,
  ccBits: BITS_MIXED
}


/**
 * Returns the number of bits needed to store the data length
 * according to QR Code specifications.
 *
 * @param  {Mode}   mode    Data mode
 * @param  {Number} version QR Code version
 * @return {Number}         Number of bits
 */
export function getCharCountIndicator(mode: ModeType, version: number): number {
  if (!mode.ccBits) throw new Error(`Invalid mode: ${mode}`);

  if (!_isValid(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  if (version >= 1 && version < 10) return mode.ccBits[0];
  else if (version < 27) return mode.ccBits[1];
  return mode.ccBits[2];
}

/**
 * Returns the most efficient mode to store the specified data
 *
 * @param  {String} dataStr Input data string
 * @return {Mode}           Best mode
 */
export function getBestModeForData(dataStr: string): ModeType {
  if (testNumeric(dataStr)) return NUMERIC;
  else if (testAlphanumeric(dataStr)) return ALPHANUMERIC;
  else if (testKanji(dataStr)) return KANJI;
  else return BYTE;
}

/**
 * Return mode name as string
 *
 * @param {Mode} mode Mode object
 * @returns {String}  Mode name
 */
export function toString(mode: ModeType): string {
  if (mode?.id) return mode.id;
  throw new Error('Invalid mode');
}

/**
 * Check if input param is a valid mode object
 *
 * @param   {Mode}    mode Mode object
 * @returns {Boolean} True if valid mode, false otherwise
 */
export function isValid(mode: ModeType): boolean {
  return mode.bit && !!mode.ccBits;
}

/**
 * Get mode object from its name
 *
 * @param   {String} string Mode name
 * @returns {Mode}          Mode object
 */
function fromString(modeStr: string): ModeType {
  const lcStr = modeStr.toLowerCase();

  switch (lcStr) {
    case 'numeric':
      return NUMERIC;
    case 'alphanumeric':
      return ALPHANUMERIC;
    case 'kanji':
      return KANJI;
    case 'byte':
      return BYTE;
    default:
      throw new Error(`Unknown mode: ${modeStr}`);
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
export function from(value: ModeType | string, defaultValue: ModeType): ModeType {
  if (typeof value !== 'string') {
    return isValid(value) ? value : defaultValue;
  } else {
    try {
      return fromString(value);
    } catch {
      return defaultValue;
    }
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
