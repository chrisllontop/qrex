import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import sinon from "sinon";
import * as fs from "node:fs";
import QRCode from "./../../src/core/qrcode.js";
import Utf8Renderer from "../../../src/renderer/utf8.js";
import Utils from "../../../src/renderer/utils.js";

test("Utf8Renderer interface", (t: AssertionHandler) => {
  t.type(Utf8Renderer.render, "function", "Should have render function");

  t.end();
});

test("Utf8Renderer render", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });
  let str;

  t.doesNotThrow(() => {
    str = Utf8Renderer.render(sampleQrData);
  }, "Should not throw with only qrData param");

  t.doesNotThrow(() => {
    str = Utf8Renderer.render(sampleQrData, {
      margin: 10,
      scale: 1,
    });
  }, "Should not throw with options param");

  t.type(str, "string", "Should return a string");

  t.end();
});

test("Utf8 renderToFile", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });
  const fileName = "qrimage.txt";
  let fsStub = sinon.stub(fs, "writeFile").callsArg(2);

  t.plan(5);

  Utf8Renderer.renderToFile(fileName, sampleQrData, (err: Error) => {
    t.ok(!err, "Should not generate errors with only qrData param");

    t.equal(
      fsStub.getCall(0).args[0],
      fileName,
      "Should save file with correct file name",
    );
  });

  Utf8Renderer.renderToFile(
    fileName,
    sampleQrData,
    {
      margin: 10,
      scale: 1,
    },
    (err: Error) => {
      t.ok(!err, "Should not generate errors with options param");

      t.equal(
        fsStub.getCall(0).args[0],
        fileName,
        "Should save file with correct file name",
      );
    },
  );

  fsStub.restore();
  fsStub = sinon.stub(fs, "writeFile").callsArgWith(2, new Error());

  Utf8Renderer.renderToFile(fileName, sampleQrData, (err: Error) => {
    t.ok(err, "Should fail if error occurs during save");
  });

  fsStub.restore();
});
