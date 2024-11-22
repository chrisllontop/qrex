import { describe, expect, it } from "vitest";
import { Mode } from "../../../src/core/mode";

describe("Mode bits", () => {
  const EXPECTED_BITS = {
    numeric: 1,
    alphanumeric: 2,
    byte: 4,
    kanji: 8,
    mixed: -1,
  };

  it("Mode bit values", () => {
    expect(Mode.NUMERIC.bit).toBe(EXPECTED_BITS.numeric);
    expect(Mode.ALPHANUMERIC.bit).toBe(EXPECTED_BITS.alphanumeric);
    expect(Mode.BYTE.bit).toBe(EXPECTED_BITS.byte);
    expect(Mode.KANJI.bit).toBe(EXPECTED_BITS.kanji);
    expect(Mode.MIXED.bit).toBe(EXPECTED_BITS.mixed);
  });
});

describe("Char count bits", () => {
  const EXPECTED_BITS = {
    numeric: [10, 12, 14],
    alphanumeric: [9, 11, 13],
    byte: [8, 16, 16],
    kanji: [8, 10, 12],
  };

  it("Char count indicator for versions", () => {
    for (let v = 1; v < 10; v++) {
      expect(Mode.getCharCountIndicator(Mode.NUMERIC, v)).toBe(EXPECTED_BITS.numeric[0]);
      expect(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v)).toBe(EXPECTED_BITS.alphanumeric[0]);
      expect(Mode.getCharCountIndicator(Mode.BYTE, v)).toBe(EXPECTED_BITS.byte[0]);
      expect(Mode.getCharCountIndicator(Mode.KANJI, v)).toBe(EXPECTED_BITS.kanji[0]);
    }

    for (let v = 10; v < 27; v++) {
      expect(Mode.getCharCountIndicator(Mode.NUMERIC, v)).toBe(EXPECTED_BITS.numeric[1]);
      expect(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v)).toBe(EXPECTED_BITS.alphanumeric[1]);
      expect(Mode.getCharCountIndicator(Mode.BYTE, v)).toBe(EXPECTED_BITS.byte[1]);
      expect(Mode.getCharCountIndicator(Mode.KANJI, v)).toBe(EXPECTED_BITS.kanji[1]);
    }

    for (let v = 27; v <= 40; v++) {
      expect(Mode.getCharCountIndicator(Mode.NUMERIC, v)).toBe(EXPECTED_BITS.numeric[2]);
      expect(Mode.getCharCountIndicator(Mode.ALPHANUMERIC, v)).toBe(EXPECTED_BITS.alphanumeric[2]);
      expect(Mode.getCharCountIndicator(Mode.BYTE, v)).toBe(EXPECTED_BITS.byte[2]);
      expect(Mode.getCharCountIndicator(Mode.KANJI, v)).toBe(EXPECTED_BITS.kanji[2]);
    }
  });

  it("Throws on invalid mode or version", () => {
    expect(() => Mode.getCharCountIndicator({}, 1)).toThrow();
    expect(() => Mode.getCharCountIndicator(Mode.BYTE, 0)).toThrow();
  });
});

describe("Best mode", () => {
  const EXPECTED_MODE = {
    12345: Mode.NUMERIC,
    abcde: Mode.BYTE,
    "1234a": Mode.BYTE,
    ABCDa: Mode.BYTE,
    ABCDE: Mode.ALPHANUMERIC,
    "12ABC": Mode.ALPHANUMERIC,
    乂ЁЖぞβ: Mode.KANJI,
    ΑΒΓψωЮЯабв: Mode.KANJI,
    皿a晒三: Mode.BYTE,
  };

  it("Best mode for data", () => {
    for (const data of Object.keys(EXPECTED_MODE)) {
      expect(Mode.getBestModeForData(data)).toBe(EXPECTED_MODE[data]);
    }
  });
});

describe("Is valid", () => {
  it("Valid modes", () => {
    expect(Mode.isValid(Mode.NUMERIC)).toEqual([10, 12, 14]);
    expect(Mode.isValid(Mode.ALPHANUMERIC)).toEqual([9, 11, 13]);
    expect(Mode.isValid(Mode.BYTE)).toEqual([8, 16, 16]);
    expect(Mode.isValid(Mode.KANJI)).toEqual([8, 10, 12]);
  });

  it("Invalid modes", () => {
    expect(Mode.isValid(undefined)).toBe(undefined);
    expect(Mode.isValid({ bit: 1 })).toBe(undefined);
    expect(Mode.isValid({ ccBits: [] })).toBe(undefined);
  });
});

describe("From value", () => {
  const modes = [
    { name: "numeric", mode: Mode.NUMERIC },
    { name: "alphanumeric", mode: Mode.ALPHANUMERIC },
    { name: "kanji", mode: Mode.KANJI },
    { name: "byte", mode: Mode.BYTE },
  ];

  it("From name or mode", () => {
    for (const { name, mode } of modes) {
      expect(Mode.from(name)).toBe(mode);
      expect(Mode.from(name.toUpperCase())).toBe(mode);
      expect(Mode.from(mode)).toBe(mode);
    }

    expect(Mode.from("", Mode.NUMERIC)).toBe(Mode.NUMERIC);
    expect(Mode.from(null, Mode.NUMERIC)).toBe(Mode.NUMERIC);
  });
});

describe("To string", () => {
  it("String representation of modes", () => {
    expect(Mode.toString(Mode.NUMERIC)).toBe("Numeric");
    expect(Mode.toString(Mode.ALPHANUMERIC)).toBe("Alphanumeric");
    expect(Mode.toString(Mode.BYTE)).toBe("Byte");
    expect(Mode.toString(Mode.KANJI)).toBe("Kanji");
  });

  it("Throws on invalid mode", () => {
    expect(() => Mode.toString({})).toThrow();
  });
});
