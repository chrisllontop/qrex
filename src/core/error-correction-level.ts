import type { ErrorCorrectionLevel } from "qrcode";

export const L: ErrorCorrectionLevel = { bit: 1 };
export const M: ErrorCorrectionLevel = { bit: 0 };
export const Q: ErrorCorrectionLevel = { bit: 3 };
export const H: ErrorCorrectionLevel = { bit: 2 };

export function fromString(errStr: string): ErrorCorrectionLevel {
  const lcStr = errStr.toLowerCase()

  switch (lcStr) {
    case 'l':
    case 'low':
      return L;

    case 'm':
    case 'medium':
      return M;

    case 'q':
    case 'quartile':
      return Q;

    case 'h':
    case 'high':
      return H;

    default:
      throw new Error(`Unknown EC Level: ${errStr}`);
  }
}

export function isValid(level: ErrorCorrectionLevel): boolean {
  return (
    level && typeof level.bit !== 'undefined' && level.bit >= 0 && level.bit < 4
  );
}

export function from(value: ErrorCorrectionLevel | string, defaultValue: ErrorCorrectionLevel): ErrorCorrectionLevel {
  if (typeof value !== 'string') {
    return isValid(value) ? value : defaultValue;
  }
  try {
    return fromString(value);
  } catch {
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
  fromString
}
