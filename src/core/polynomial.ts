import { GaloisField } from "./galois-field";

/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Uint8Array} p1 Polynomial
 * @param  {Uint8Array} p2 Polynomial
 * @return {Uint8Array}    Product of p1 and p2
 */
function mul(p1, p2) {
  const coeff = new Uint8Array(p1.length + p2.length - 1);

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GaloisField.mul(p1[i], p2[j]);
    }
  }

  return coeff;
}

/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Uint8Array} divident Polynomial
 * @param  {Uint8Array} divisor  Polynomial
 * @return {Uint8Array}          Remainder
 */
function mod(divident, divisor) {
  let result = new Uint8Array(divident);

  while (result.length - divisor.length >= 0) {
    const coeff = result[0];

    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= GaloisField.mul(divisor[i], coeff);
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
function generateECPolynomial(degree: number) {
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
