import { describe, expect, it } from "vitest";
import { ReedSolomonEncoder as RS } from "../../../src/core/reed-solomon-encoder";

describe("Reed-Solomon encoder", () => {
  it("Encoder not initialized", () => {
    const enc = new RS();
    expect(enc.genPoly).toBeUndefined();
    expect(() => enc.encode([])).toThrow("Encoder not initialized");
  });

  it("should set correct degree value and define generator polynomial", () => {
    const enc = new RS();
    enc.initialize(2);
    expect(enc.degree).toBe(2);
    expect(enc.genPoly).toBeDefined();
  });

  it("should return a number of codewords equal to the gen poly degree", () => {
    const enc = new RS();
    enc.initialize(2);
    const result = enc.encode(new Uint8Array([48, 49, 50, 51, 52]));
    expect(result.length).toBe(2);
  });

  it("should reinitialize the generator polynomial when degree changes", () => {
    const enc = new RS(2);
    const genPoly = enc.genPoly;
    expect(enc.degree).toBe(2);
    expect(enc.genPoly).toBeDefined();

    enc.initialize(3);
    expect(enc.genPoly).not.toBe(genPoly);
  });

  it("should not create a generator polynomial if degree is 0", () => {
    const enc = new RS(0);
    expect(enc.genPoly).toBeUndefined();
  });

  it("should return correct buffer when encoding data", () => {
    const enc = new RS(1);
    expect(enc.encode(new Uint8Array([0]))).toEqual(new Uint8Array([0]));
  });
});
