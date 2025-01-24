import { GaloisField } from "./galois-field";

/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Iterable<number>} p1 Polynomial
 * @param  {Iterable<number>} p2 Polynomial
 * @return {Uint8Array}    Product of p1 and p2
 */
function mul(p1: Iterable<number>, p2: Iterable<number>): Uint8Array {
  const p1Arr = new Uint8Array([...p1]);
  const p2Arr = new Uint8Array([...p2]);
  const coeff = new Uint8Array(p1Arr.length + p2Arr.length - 1);

  for (let i = 0; i < p1Arr.length; i++) {
    for (let j = 0; j < p2Arr.length; j++) {
      coeff[i + j] ^= GaloisField.mul(p1Arr[i], p2Arr[j]);
    }
  }

  return coeff;
}

/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Iterable<number>} divident Polynomial
 * @param  {Iterable<number>} divisor  Polynomial
 * @return {Uint8Array}          Remainder
 */
function mod(divident: Iterable<number>, divisor: Iterable<number>): Uint8Array {
  let result = new Uint8Array([...divident]);
  const divisorArr = new Uint8Array([...divisor]);

  while (result.length - divisorArr.length >= 0) {
    const coeff = result[0];

    for (let i = 0; i < divisorArr.length; i++) {
      result[i] ^= GaloisField.mul(divisorArr[i], coeff);
    }

    // remove all zeros from buffer head
    let offset = 0;
    while (offset < result.length && result[offset] === 0) offset++;
    result = result.slice(offset);
  }

  return result;
}

/**
 * Generate an irreducible generator polynomial of specified degree
 * (used by Reed-Solomon encoder)
 */
function generateECPolynomial(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    poly = mul(poly, new Uint8Array([1, GaloisField.exp(i)]));
  }

  return poly;
}

export const Polynomial = {
  mul,
  mod,
  generateECPolynomial,
};
