import { type DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import Helpers from "../helpers.js";
import * as QRCode from "../../src/index.js";
import * as QRCodeBrowser from "../../src/browser.js";
import { restoreNativePromise, removeNativePromise } from "../helpers.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

test("toString - no promise available", (t: AssertionHandler) => {
  removeNativePromise();

  t.throws(() => {
    QRCode.toString();
  }, "Should throw if text is not provided");

  t.throws(() => {
    QRCode.toString("some text");
  }, "Should throw if a callback is not provided");

  t.throws(() => {
    QRCode.toString("some text", {});
  }, "Should throw if a callback is not a function");

  t.throws(() => {
    QRCode.toString();
  }, "Should throw if text is not provided (browser)");

  t.throws(() => {
    QRCodeBrowser.toString("some text");
  }, "Should throw if a callback is not provided (browser)");

  t.throws(() => {
    QRCodeBrowser.toString("some text", {});
  }, "Should throw if a callback is not a function (browser)");

  t.end();

  restoreNativePromise();
});

test("toString", (t: AssertionHandler) => {
  t.plan(5);

  t.throws(() => {
    QRCode.toString();
  }, "Should throw if text is not provided");

  QRCode.toString("some text", (err: Error, str: string) => {
    t.ok(!err, "There should be no error");
    t.equal(typeof str, "string", "Should return a string");
  });

  t.equals(
    typeof QRCode.toString("some text").then,
    "function",
    "Should return a promise",
  );

  QRCode.toString("some text", { errorCorrectionLevel: "L" }).then(
    (str: string) => {
      t.equal(typeof str, "string", "Should return a string");
    },
  );
});

test("toString (browser)", (t: AssertionHandler) => {
  t.plan(5);

  t.throws(() => {
    browser.toString();
  }, "Should throw if text is not provided");

  browser.toString("some text", (err: Error, str: string) => {
    t.ok(!err, "There should be no error (browser)");
    t.equal(typeof str, "string", "Should return a string (browser)");
  });

  t.equals(
    typeof browser.toString("some text").then,
    "function",
    "Should return a promise",
  );

  browser
    .toString("some text", { errorCorrectionLevel: "L" })
    .then((str: string) => {
      t.equal(typeof str, "string", "Should return a string");
    });
});

test("toString svg", (t: AssertionHandler) => {
  const file = path.join(__dirname, "/svgtag.expected.out");
  t.plan(6);

  QRCode.toString(
    "http://www.google.com",
    {
      version: 1, // force version=1 to trigger an error
      errorCorrectionLevel: "H",
      type: "svg",
    },
    (err: Error, code: string | null) => {
      t.ok(err, "there should be an error ");
      t.notOk(code, "string should be null");
    },
  );

  fs.readFile(file, "utf8", (err: Error, expectedSvg: string) => {
    if (err) throw err;

    QRCode.toString(
      "http://www.google.com",
      {
        errorCorrectionLevel: "H",
        type: "svg",
      },
      (err: Error, code: string) => {
        t.ok(!err, "There should be no error");
        t.equal(code, expectedSvg, "should output a valid svg");
      },
    );
  });

  QRCode.toString("http://www.google.com", {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: "H",
    type: "svg",
  }).catch((err: Error) => {
    t.ok(err, "there should be an error (promise)");
  });

  fs.readFile(file, "utf8", (err: Error, expectedSvg: string) => {
    if (err) throw err;

    QRCode.toString("http://www.google.com", {
      errorCorrectionLevel: "H",
      type: "svg",
    }).then((code: string) => {
      t.equal(code, expectedSvg, "should output a valid svg (promise)");
    });
  });
});

test("toString browser svg", (t: AssertionHandler) => {
  const file = path.join(__dirname, "/svgtag.expected.out");

  t.plan(3);

  fs.readFile(file, "utf8", (err: Error, expectedSvg: string) => {
    if (err) throw err;

    browser.toString(
      "http://www.google.com",
      {
        errorCorrectionLevel: "H",
        type: "svg",
      },
      (err: Error, code: string) => {
        t.ok(!err, "There should be no error");
        t.equal(code, expectedSvg, "should output a valid svg");
      },
    );

    browser
      .toString("http://www.google.com", {
        errorCorrectionLevel: "H",
        type: "svg",
      })
      .then((code: string) => {
        t.equal(code, expectedSvg, "should output a valid svg (promise)");
      });
  });
});

test("toString utf8", (t: AssertionHandler) => {
  const expectedUtf8 = [
    "                                 ",
    "                                 ",
    "    █▀▀▀▀▀█ █ ▄█  ▀ █ █▀▀▀▀▀█    ",
    "    █ ███ █ ▀█▄▀▄█ ▀▄ █ ███ █    ",
    "    █ ▀▀▀ █ ▀▄ ▄ ▄▀ █ █ ▀▀▀ █    ",
    "    ▀▀▀▀▀▀▀ ▀ ▀ █▄▀ █ ▀▀▀▀▀▀▀    ",
    "    ▀▄ ▀▀▀▀█▀▀█▄ ▄█▄▀█ ▄█▄██▀    ",
    "    █▄ ▄▀▀▀▄▄█ █▀▀▄█▀ ▀█ █▄▄█    ",
    "    █▄ ▄█▄▀█▄▄  ▀ ▄██▀▀ ▄  ▄▀    ",
    "    █▀▄▄▄▄▀▀█▀▀█▀▀▀█ ▀ ▄█▀█▀█    ",
    "    ▀ ▀▀▀▀▀▀███▄▄▄▀ █▀▀▀█ ▀█     ",
    "    █▀▀▀▀▀█ █▀█▀▄ ▄▄█ ▀ █▀ ▄█    ",
    "    █ ███ █ █ █ ▀▀██▀███▀█ ██    ",
    "    █ ▀▀▀ █  █▀ ▀ █ ▀▀▄██ ███    ",
    "    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ",
    "                                 ",
    "                                 ",
  ].join("\n");

  t.plan(9);

  QRCode.toString(
    "http://www.google.com",
    {
      version: 1, // force version=1 to trigger an error
      errorCorrectionLevel: "H",
      type: "utf8",
    },
    (err: Error, code: string | null) => {
      t.ok(err, "there should be an error ");
      t.notOk(code, "string should be null");
    },
  );

  QRCode.toString(
    "http://www.google.com",
    {
      errorCorrectionLevel: "M",
      type: "utf8",
    },
    (err: Error, code: string) => {
      t.ok(!err, "There should be no error");
      t.equal(code, expectedUtf8, "should output a valid symbol");
    },
  );

  QRCode.toString("http://www.google.com", (err: Error, code: string) => {
    t.ok(!err, "There should be no error");
    t.equal(
      code,
      expectedUtf8,
      "Should output a valid symbol with default options",
    );
  });

  QRCode.toString("http://www.google.com", {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: "H",
    type: "utf8",
  }).catch((err: Error) => {
    t.ok(err, "there should be an error (promise)");
  });

  QRCode.toString("http://www.google.com", {
    errorCorrectionLevel: "M",
    type: "utf8",
  }).then((code: string) => {
    t.equal(code, expectedUtf8, "should output a valid symbol (promise)");
  });

  QRCode.toString("http://www.google.com").then((code: string) => {
    t.equal(
      code,
      expectedUtf8,
      "Should output a valid symbol with default options (promise)",
    );
  });
});

test("toString terminal", (t: AssertionHandler) => {
  const expectedTerminal =
    fs.readFileSync(path.join(__dirname, "/terminal.expected.out")) + "";

  t.plan(3);

  QRCode.toString(
    "http://www.google.com",
    {
      errorCorrectionLevel: "M",
      type: "terminal",
    },
    (err: Error, code: string) => {
      t.ok(!err, "There should be no error");
      t.equal(code + "\n", expectedTerminal, "should output a valid symbol");
    },
  );

  QRCode.toString("http://www.google.com", {
    errorCorrectionLevel: "M",
    type: "terminal",
  }).then((code: string) => {
    t.equal(
      code + "\n",
      expectedTerminal,
      "should output a valid symbol (promise)",
    );
  });
});

test("toString byte-input", (t: AssertionHandler) => {
  const expectedOutput = [
    "                             ",
    "                             ",
    "    █▀▀▀▀▀█  █▄█▀ █▀▀▀▀▀█    ",
    "    █ ███ █ ▀█ █▀ █ ███ █    ",
    "    █ ▀▀▀ █   ▀ █ █ ▀▀▀ █    ",
    "    ▀▀▀▀▀▀▀ █▄▀▄█ ▀▀▀▀▀▀▀    ",
    "    ▀██▄██▀▀▀█▀▀ ▀█  ▄▀▄     ",
    "    ▀█▀▄█▄▀▄ ██ ▀ ▄ ▀▄  ▀    ",
    "    ▀ ▀ ▀▀▀▀█▄ ▄▀▄▀▄▀▄▀▄▀    ",
    "    █▀▀▀▀▀█ █  █▄█▀█▄█  ▀    ",
    "    █ ███ █ ▀█▀▀ ▀██  ▀█▀    ",
    "    █ ▀▀▀ █ ██▀ ▀ ▄ ▀▄▀▄▀    ",
    "    ▀▀▀▀▀▀▀ ▀▀▀ ▀ ▀▀▀ ▀▀▀    ",
    "                             ",
    "                             ",
  ].join("\n");
  const byteInput = new Uint8ClampedArray([1, 2, 3, 4, 5]);

  t.plan(2);

  QRCode.toString(
    [{ data: byteInput, mode: "byte" }],
    { errorCorrectionLevel: "L" },
    (err: Error, code: string) => {
      t.ok(!err, "there should be no error");
      t.equal(code, expectedOutput, "should output the correct code");
    },
  );
});
