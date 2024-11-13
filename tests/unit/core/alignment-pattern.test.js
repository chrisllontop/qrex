import { describe, it, expect } from "vitest";
import { AlignmentPattern as pattern } from "../../../src/core/alignment-pattern";

/**
 * Row/column coordinates of the center module of each alignment pattern.
 * Each sub-array refers to a qr code version.
 *
 * @type {Array}
 */
const EXPECTED_POSITION_TABLE = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
];

describe("Alignment pattern tests", () => {
  it("should return correct row/col coords", () => {
    for (let i = 1; i <= 40; i++) {
      const pos = pattern.getRowColCoords(i);
      expect(pos).toEqual(EXPECTED_POSITION_TABLE[i - 1]);
    }
  });

  it("should return correct number of positions", () => {
    for (let i = 1; i <= 40; i++) {
      const pos = pattern.getPositions(i);
      const expectedPos = EXPECTED_POSITION_TABLE[i - 1];
      const expectedLength = (Math.pow(expectedPos.length, 2) || 3) - 3;

      expect(pos.length).toBe(expectedLength);

      pos.forEach((position) => {
        position.forEach((coord) => {
          expect(expectedPos.includes(coord)).toBe(true);
        });
      });
    }
  });
});
