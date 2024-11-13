import { type Mode } from "./mode";

export const L: Mode = { bit: 1 };
export const M: Mode = { bit: 0 };
export const Q: Mode = { bit: 3 };
export const H: Mode = { bit: 2 };

function fromString(errStr: string): Mode {
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

export function isValid(level: Mode): boolean {
  return (
    level && typeof level.bit !== 'undefined' && level.bit >= 0 && level.bit < 4
  );
}

export function from(value: Mode, defaultValue: Mode): Mode {
  if (isValid(value)) {
    return value;
  }

  try {
    return fromString(value);
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
