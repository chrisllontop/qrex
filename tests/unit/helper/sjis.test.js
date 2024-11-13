import { describe, it, expect } from 'vitest';
import toSJIS from '../../../helper/to-sjis';

describe("SJIS from char", () => {
  it("should return undefined if character is invalid", () => {
    expect(toSJIS("")).toBeUndefined();
  });

  it("should return undefined if character is not a kanji", () => {
    expect(toSJIS("A")).toBeUndefined();
  });

  it("should return correct SJIS value for 襦", () => {
    expect(toSJIS("襦")).toBe(0xe640);
  });

  it("should return correct SJIS value for ￢", () => {
    expect(toSJIS("￢")).toBe(0x81ca);
  });

  it("should return correct SJIS value for ≧", () => {
    expect(toSJIS("≧")).toBe(0x8186);
  });

  it("should return correct SJIS value for ⊥", () => {
    expect(toSJIS("⊥")).toBe(0x81db);
  });

  it("should return correct SJIS value for 愛", () => {
    expect(toSJIS("愛")).toBe(0x88a4);
  });

  it("should return correct SJIS value for 衣", () => {
    expect(toSJIS("衣")).toBe(0x88df);
  });

  it("should return correct SJIS value for 蔭", () => {
    expect(toSJIS("蔭")).toBe(0x88fc);
  });
});
