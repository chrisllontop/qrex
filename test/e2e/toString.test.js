const test = require("tap").test;
const fs = require("fs");
const path = require("path");
const QRCode = require("src");
const browser = require("src/browser");
const Helpers = require("test/helpers");

test("toString - no promise available", (t) => {
  Helpers.removeNativePromise();

  t.throw(() => {
    QRCode.toString();
  }, "Should throw if text is not provided");

  t.throw(() => {
    QRCode.toString("some text");
  }, "Should throw if a callback is not provided");

  t.throw(() => {
    QRCode.toString("some text", {});
  }, "Should throw if a callback is not a function");

  t.throw(() => {
    QRCode.toString();
  }, "Should throw if text is not provided (browser)");

  t.throw(() => {
    browser.toString("some text");
  }, "Should throw if a callback is not provided (browser)");

  t.throw(() => {
    browser.toString("some text", {});
  }, "Should throw if a callback is not a function (browser)");

  t.end();

  Helpers.restoreNativePromise();
});

test("toString", (t) => {
  t.plan(5);

  t.throw(() => {
    QRCode.toString();
  }, "Should throw if text is not provided");

  QRCode.toString("some text", (err, str) => {
    t.ok(!err, "There should be no error");
    t.equals(typeof str, "string", "Should return a string");
  });

  t.equals(
    typeof QRCode.toString("some text").then,
    "function",
    "Should return a promise",
  );

  QRCode.toString("some text", { errorCorrectionLevel: "L" }).then(
    (str) => {
      t.equals(typeof str, "string", "Should return a string");
    },
  );
});

test("toString (browser)", (t) => {
  t.plan(5);

  t.throw(() => {
    browser.toString();
  }, "Should throw if text is not provided");

  browser.toString("some text", (err, str) => {
    t.ok(!err, "There should be no error (browser)");
    t.equals(typeof str, "string", "Should return a string (browser)");
  });

  t.equals(
    typeof browser.toString("some text").then,
    "function",
    "Should return a promise",
  );

  browser
    .toString("some text", { errorCorrectionLevel: "L" })
    .then((str) => {
      t.equals(typeof str, "string", "Should return a string");
    });
});

test("toString svg", (t) => {
  const file = path.join(__dirname, "/svgtag.expected.out");
  t.plan(6);

  QRCode.toString(
    "http://www.google.com",
    {
      version: 1, // force version=1 to trigger an error
      errorCorrectionLevel: "H",
      type: "svg",
    },
    (err, code) => {
      t.ok(err, "there should be an error ");
      t.notOk(code, "string should be null");
    },
  );

  fs.readFile(file, "utf8", (err, expectedSvg) => {
    if (err) throw err;

    QRCode.toString(
      "http://www.google.com",
      {
        errorCorrectionLevel: "H",
        type: "svg",
      },
      (err, code) => {
        t.ok(!err, "There should be no error");
        t.equal(code, expectedSvg, "should output a valid svg");
      },
    );
  });

  QRCode.toString("http://www.google.com", {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: "H",
    type: "svg",
  }).catch((err) => {
    t.ok(err, "there should be an error (promise)");
  });

  fs.readFile(file, "utf8", (err, expectedSvg) => {
    if (err) throw err;

    QRCode.toString("http://www.google.com", {
      errorCorrectionLevel: "H",
      type: "svg",
    }).then((code) => {
      t.equal(code, expectedSvg, "should output a valid svg (promise)");
    });
  });
});

test("toString browser svg", (t) => {
  const file = path.join(__dirname, "/svgtag.expected.out");

  t.plan(3);

  fs.readFile(file, "utf8", (err, expectedSvg) => {
    if (err) throw err;

    browser.toString(
      "http://www.google.com",
      {
        errorCorrectionLevel: "H",
        type: "svg",
      },
      (err, code) => {
        t.ok(!err, "There should be no error");
        t.equal(code, expectedSvg, "should output a valid svg");
      },
    );

    browser
      .toString("http://www.google.com", {
        errorCorrectionLevel: "H",
        type: "svg",
      })
      .then((code) => {
        t.equal(code, expectedSvg, "should output a valid svg (promise)");
      });
  });
});

test("toString utf8", (t) => {
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
    (err, code) => {
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
    (err, code) => {
      t.ok(!err, "There should be no error");
      t.equal(code, expectedUtf8, "should output a valid symbol");
    },
  );

  QRCode.toString("http://www.google.com", (err, code) => {
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
  }).catch((err) => {
    t.ok(err, "there should be an error (promise)");
  });

  QRCode.toString("http://www.google.com", {
    errorCorrectionLevel: "M",
    type: "utf8",
  }).then((code) => {
    t.equal(code, expectedUtf8, "should output a valid symbol (promise)");
  });

  QRCode.toString("http://www.google.com").then((code) => {
    t.equal(
      code,
      expectedUtf8,
      "Should output a valid symbol with default options (promise)",
    );
  });
});

test("toString terminal", (t) => {
  const expectedTerminal =
    fs.readFileSync(path.join(__dirname, "/terminal.expected.out")) + "";

  t.plan(3);

  QRCode.toString(
    "http://www.google.com",
    {
      errorCorrectionLevel: "M",
      type: "terminal",
    },
    (err, code) => {
      t.ok(!err, "There should be no error");
      t.equal(code + "\n", expectedTerminal, "should output a valid symbol");
    },
  );

  QRCode.toString("http://www.google.com", {
    errorCorrectionLevel: "M",
    type: "terminal",
  }).then((code) => {
    t.equal(
      code + "\n",
      expectedTerminal,
      "should output a valid symbol (promise)",
    );
  });
});

test("toString byte-input", (t) => {
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
    (err, code) => {
      t.ok(!err, "there should be no error");
      t.equal(code, expectedOutput, "should output the correct code");
    },
  );
});
