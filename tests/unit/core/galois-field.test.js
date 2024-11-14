import { describe, expect, it } from "vitest";
import { GaloisField as GF } from "../../../src/core/galois-field";

describe("Galois Field", () => {
  it("should throw for log(n) with n < 1", () => {
    expect(() => GF.log(0)).toThrow("log(0)");
  });

  it("should return 0 if first param is 0", () => {
    expect(GF.mul(0, 1)).toBe(0);
  });

  it("should return 0 if second parameter is 0 in multiplication", () => {
    expect(GF.mul(1, 0)).toBe(0);
  });

  it("should return 0 if both parameters are 0 in multiplication", () => {
    expect(GF.mul(0, 0)).toBe(0);
  });
});
