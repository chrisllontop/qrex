import type { ErrorCorrectionLevel, ErrorCorrectionLevelBit, ErrorCorrectionLevelString } from "../types/qrex.type";

const L: ErrorCorrectionLevelBit = { bit: 1 };
const M: ErrorCorrectionLevelBit = { bit: 0 };
const Q: ErrorCorrectionLevelBit = { bit: 3 };
const H: ErrorCorrectionLevelBit = { bit: 2 };

function fromString(string: ErrorCorrectionLevelString) {
  if (typeof string !== "string") {
    throw new Error("Param is not a string");
  }

  const lcStr = string.toLowerCase();

  switch (lcStr) {
    case "l":
    case "low":
      return L;

    case "m":
    case "medium":
      return M;

    case "q":
    case "quartile":
      return Q;

    case "h":
    case "high":
      return H;

    default:
      throw new Error(`Unknown EC Level: ${string}`);
  }
}

function isValid(level: ErrorCorrectionLevelBit) {
  return level && typeof level?.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
}

function from(value: ErrorCorrectionLevel, defaultValue: ErrorCorrectionLevelBit): ErrorCorrectionLevelBit {
  try {
    if (typeof value === "string") {
      return fromString(value);
    }

    if (isValid(value)) {
      return value;
    }
  } catch (e) {
    return defaultValue;
  }
}

export const ECLevel = {
  L,
  M,
  Q,
  H,
  from,
  isValid,
};
