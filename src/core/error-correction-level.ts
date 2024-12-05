import type { ErrorCorrectionLevelBit } from "../types/qrex.type";

export const L: ErrorCorrectionLevelBit = { bit: 1 };
export const M: ErrorCorrectionLevelBit = { bit: 0 };
export const Q: ErrorCorrectionLevelBit = { bit: 3 };
export const H: ErrorCorrectionLevelBit = { bit: 2 };

function fromString(string: string): ErrorCorrectionLevelBit {
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

export function isValid(level: ErrorCorrectionLevelBit): boolean {
  return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
}

export function from(
  value: ErrorCorrectionLevelBit | string,
  defaultValue?: ErrorCorrectionLevelBit,
): ErrorCorrectionLevelBit {
  if (isValid(value as ErrorCorrectionLevelBit)) {
    return value as ErrorCorrectionLevelBit;
  }

  try {
    return fromString(value as string);
  } catch (e) {
    return defaultValue!;
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
