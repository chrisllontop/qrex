import { describe, expect, it } from "vitest";
import { Regex } from "../../../src/core/regex.js";

describe("Regex", () => {
  it("should export a regex for NUMERIC", () => {
    expect(Regex.NUMERIC).toBeInstanceOf(RegExp);
  });

  it("should export a regex for ALPHANUMERIC", () => {
    expect(Regex.ALPHANUMERIC).toBeInstanceOf(RegExp);
  });

  it("should export a regex for BYTE", () => {
    expect(Regex.BYTE).toBeInstanceOf(RegExp);
  });

  it("should export a regex for KANJI", () => {
    expect(Regex.KANJI).toBeInstanceOf(RegExp);
  });

  it("should export a regex for BYTE_KANJI", () => {
    expect(Regex.BYTE_KANJI).toBeInstanceOf(RegExp);
  });
});

describe("Regex test", () => {
  it("should return true if the string is numeric", () => {
    expect(Regex.testNumeric("123456")).toBe(true);
  });

  it("should return false if the string is not numeric", () => {
    expect(Regex.testNumeric("a12345")).toBe(false);
    expect(Regex.testNumeric("ABC123")).toBe(false);
  });

  it("should return true if the string is alphanumeric", () => {
    expect(Regex.testAlphanumeric("123ABC")).toBe(true);
    expect(Regex.testAlphanumeric("123456")).toBe(true);
  });

  it("should return false if the string is not alphanumeric", () => {
    expect(Regex.testAlphanumeric("ABCabc")).toBe(false);
  });

  it("should return true if the string is kanji", () => {
    expect(Regex.testKanji("乂ЁЖぞβ")).toBe(true);
  });

  it("should return false if the string is not kanji", () => {
    expect(Regex.testKanji("皿a晒三A")).toBe(false);
    expect(Regex.testKanji("123456")).toBe(false);
    expect(Regex.testKanji("ABC123")).toBe(false);
    expect(Regex.testKanji("abcdef")).toBe(false);
  });
});
