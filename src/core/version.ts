import type { DataMode, ErrorCorrectionLevel, ErrorCorrectionLevelBit, Segment } from "../types/qrex.type";
import { ECCode } from "./error-correction-code";
import { ECLevel } from "./error-correction-level";
import { Mode } from "./mode";
import { CoreUtils } from "./utils";
import { VersionCheck } from "./version-check";

/** Generator polynomial used to encode version information */
const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
const G18_BCH = CoreUtils.getBCHDigit(G18);

function getBestVersionForDataLength(mode: DataMode, length: number, errorCorrectionLevel: ErrorCorrectionLevelBit) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion;
    }
  }

  throw new Error("Data is too long to fit in a QR Code");
}

function getReservedBitsCount(mode: DataMode, version: number) {
  // Character count indicator + mode indicator bits
  return Mode.getCharCountIndicator(mode, version) + 4;
}

function getTotalBitsFromDataArray(segments: Segment[], version: number) {
  let totalBits = 0;

  for (const data of segments) {
    const reservedBits = getReservedBitsCount(data.mode, version);
    totalBits += reservedBits + data.getBitsLength();
  }

  return totalBits;
}

function getBestVersionForMixedData(segments: Segment[], errorCorrectionLevel: ErrorCorrectionLevelBit) {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    const length = getTotalBitsFromDataArray(segments, currentVersion);
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
      return currentVersion;
    }
  }

  return undefined;
}

/**
 * Returns version number from a value.
 * If value is not a valid version, triggers an error
 */
function from(value: number) {
  if (VersionCheck.isValid(value)) {
    return value;
  }

  throw new Error("No valid version provided");
}

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 */
function getCapacity(version: number, errorCorrectionLevel: ErrorCorrectionLevelBit, mode: DataMode) {
  if (!VersionCheck.isValid(version)) {
    throw new Error("Invalid QR Code version");
  }

  // Use Byte mode as default
  if (typeof mode === "undefined") mode = Mode.BYTE;

  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = CoreUtils.getSymbolTotalCodewords(version);

  // Total number of error correction codewords
  const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);

  // Total number of data codewords
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

  if (mode === Mode.MIXED) return dataTotalCodewordsBits;

  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

  // Return max number of storable codewords
  switch (mode) {
    case Mode.NUMERIC:
      return Math.floor((usableBits / 10) * 3);

    case Mode.ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2);

    case Mode.KANJI:
      return Math.floor(usableBits / 13);
    default:
      return Math.floor(usableBits / 8);
  }
}

/**
 * Returns the minimum version needed to contain the amount of data
 */
function getBestVersionForData(data: Segment[], errorCorrectionLevel: ErrorCorrectionLevel): number {
  let seg: Segment;

  const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);

  if (Array.isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl)!;
    }

    if (data.length === 0) {
      return 1;
    }

    seg = data[0];
  } else {
    seg = data;
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
}

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 */
function getEncodedBits(version: number) {
  if (!VersionCheck.isValid(version) || version < 7) {
    throw new Error("Invalid QR Code version");
  }

  let d = version << 12;

  while (CoreUtils.getBCHDigit(d) - G18_BCH >= 0) {
    d ^= G18 << (CoreUtils.getBCHDigit(d) - G18_BCH);
  }

  return (version << 12) | d;
}

export const Version = {
  from,
  getCapacity,
  getBestVersionForData,
  getEncodedBits,
};
