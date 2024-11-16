import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import { Canvas, createCanvas } from "canvas";
import QRCode from "src";
import Helpers from "test/helpers";

test("toCanvas - no promise available", (t: AssertionHandler) => {
  Helpers.removeNativePromise();

  // Mock document object
  global.document = {
    createElement: (el) => {
      if (el === "canvas") {
        return createCanvas(200, 200);
      }
    },
  };
  const canvasEl = createCanvas(200, 200);

  t.throw(() => {
    QRCode.toCanvas();
  }, "Should throw if no arguments are provided");

  t.throw(() => {
    QRCode.toCanvas("some text");
  }, "Should throw if a callback is not provided");

  t.throw(() => {
    QRCode.toCanvas(canvasEl, "some text");
  }, "Should throw if a callback is not provided");

  t.throw(() => {
    QRCode.toCanvas(canvasEl, "some text", {});
  }, "Should throw if callback is not a function");

  t.end();

  global.document = undefined;
  Helpers.restoreNativePromise();
});

test("toCanvas", (t: AssertionHandler) => {
  // Mock document object
  global.document = {
    createElement: (el: string) => {
      if (el === "canvas") {
        return createCanvas(200, 200);
      }
    },
  };

  t.plan(7);

  t.throw(() => {
    QRCode.toCanvas();
  }, "Should throw if no arguments are provided");

  QRCode.toCanvas("some text", (err: Error, canvasEl: HTMLCanvasElement) => {
    t.ok(!err, "There should be no error");
    t.ok(canvasEl instanceof Canvas, "Should return a new canvas object");
  });

  QRCode.toCanvas(
    "some text",
    {
      errorCorrectionLevel: "H",
    },
    (err: Error, canvasEl: HTMLCanvasElement) => {
      t.ok(!err, "There should be no error");
      t.ok(canvasEl instanceof Canvas, "Should return a new canvas object");
    },
  );

  QRCode.toCanvas("some text").then((canvasEl: ) => {
    t.ok(
      canvasEl instanceof Canvas,
      "Should return a new canvas object (promise)",
    );
  });

  QRCode.toCanvas("some text", {
    errorCorrectionLevel: "H",
  }).then((canvasEl: HTMLCanvasElement) => {
    t.ok(
      canvasEl instanceof Canvas,
      "Should return a new canvas object (promise)",
    );
  });

  global.document = undefined;
});

test("toCanvas with specified canvas element", (t) => {
  const canvasEl = createCanvas(200, 200);

  t.plan(6);

  QRCode.toCanvas(canvasEl, "some text", (err: Error, canvasEl: HTMLCanvasElement) => {
    t.ok(!err, "There should be no error");
    t.ok(canvasEl instanceof Canvas, "Should return a new canvas object");
  });

  QRCode.toCanvas(
    canvasEl,
    "some text",
    {
      errorCorrectionLevel: "H",
    },
    (err: Error, canvasEl: HTMLCanvasElement) => {
      t.ok(!err, "There should be no error");
      t.ok(canvasEl instanceof Canvas, "Should return a new canvas object");
    },
  );

  QRCode.toCanvas(canvasEl, "some text").then((canvasEl: HTMLCanvasElement) => {
    t.ok(
      canvasEl instanceof Canvas,
      "Should return a new canvas object (promise)",
    );
  });

  QRCode.toCanvas(canvasEl, "some text", {
    errorCorrectionLevel: "H",
  }).then((canvasEl: HTMLCanvasElement) => {
    t.ok(
      canvasEl instanceof Canvas,
      "Should return a new canvas object (promise)",
    );
  });
});
