const L = { bit: 1 };
const M = { bit: 0 };
const Q = { bit: 3 };
const H = { bit: 2 };

function fromString(string) {
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

function isValid(level) {
  return (
    level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4
  );
}

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

export const ECLevel = {
  L,
  M,
  Q,
  H,
  from,
  isValid,
};
