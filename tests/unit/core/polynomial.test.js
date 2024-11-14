import { describe, test, expect } from "vitest";
import { Polynomial } from "../../../src/core/polynomial";

describe("Generator Polynomial", () => {
  test("Should return an Uint8Array for degree 0", () => {
    const result = Polynomial.generateECPolynomial(0);
    expect(result instanceof Uint8Array).toBe(true);
    expect(result).toEqual(new Uint8Array([1]));
  });

  test("Should return a number of coefficients equal to (degree + 1)", () => {
    for (let e = 2; e <= 68; e++) {
      expect(Polynomial.generateECPolynomial(e).length).toBe(e + 1);
    }
  });
});

describe("Polynomial Operations", () => {
  test("Should return correct result for polynomial multiplication", () => {
    const p1 = [0, 1, 2, 3, 4];
    const p2 = [5, 6];

    const result = Polynomial.mul(p1, p2);
    expect(result instanceof Uint8Array).toBe(true);
    expect(result.length).toBe(6);
  });

  test("Should return correct result for polynomial modulus", () => {
    const p1 = [0, 1, 2, 3, 4];
    const result = Polynomial.mod(p1, Polynomial.generateECPolynomial(2));
    expect(result instanceof Uint8Array).toBe(true);
    expect(result.length).toBe(2);
  });
});
