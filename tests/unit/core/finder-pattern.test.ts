import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import pattern from "core/finder-pattern";

test("Finder pattern", (t: AssertionHandler) => {
  for (let i = 1; i <= 40; i++) {
    t.equal(
      pattern.getPositions(i).length,
      3,
      "Should always return 3 pattern positions",
    );
  }

  t.end();
});
