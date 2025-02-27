import { CoreUtils } from "./utils.js";

const FINDER_PATTERN_SIZE = 7;

/**
 * Returns an array containing the positions of each finder pattern.
 * Each array's element represent the top-left point of the pattern as (x, y) coordinates
 */
function getPositions(version: number): Array<[number, number]> {
  const size = CoreUtils.getSymbolSize(version);

  return [
    // top-left
    [0, 0],
    // top-right
    [size - FINDER_PATTERN_SIZE, 0],
    // bottom-left
    [0, size - FINDER_PATTERN_SIZE],
  ];
}

export const FinderPattern = {
  getPositions,
};
