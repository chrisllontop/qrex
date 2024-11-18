import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import { PNG } from "pngjs";
import sinon from "sinon";
import * as fs from "node:fs";
import QRCode from "../../../src/core/qrcode.js";
import PngRenderer from "../../../src/renderer/png.js";
import StreamMock from "../../mocks/writable-stream.js";

test("PNG renderer interface", (t: AssertionHandler) => {
  t.type(PngRenderer.render, "function", "Should have render function");

  t.type(
    PngRenderer.renderToDataURL,
    "function",
    "Should have renderToDataURL function",
  );

  t.type(
    PngRenderer.renderToFile,
    "function",
    "Should have renderToFile function",
  );

  t.type(
    PngRenderer.renderToFileStream,
    "function",
    "Should have renderToFileStream function",
  );

  t.end();
});

test("PNG render", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });
  let png;

  t.doesNotThrow(() => {
    png = PngRenderer.render(sampleQrData);
  }, "Should not throw with only qrData param");

  t.ok(png instanceof PNG, "Should return an instance of PNG");

  t.equal(png.width, png.height, "Should be a square image");

  // modules: 25, margins: 4 * 2, scale: 4
  t.equal(png.width, (25 + 4 * 2) * 4, "Should have correct size");

  t.doesNotThrow(() => {
    png = PngRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1,
    });
  }, "Should not throw with options param");

  t.equal(png.width, png.height, "Should be a square image");

  // modules: 25, margins: 10 * 2, scale: 1
  t.equal(png.width, 25 + 10 * 2, "Should have correct size");

  t.end();
});

test("PNG renderToDataURL", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });

  t.plan(6);

  PngRenderer.renderToDataURL(sampleQrData, (err: Error, url: string) => {
    t.ok(!err, "Should not generate errors with only qrData param");

    t.type(url, "string", "Should return a string");
  });

  PngRenderer.renderToDataURL(
    sampleQrData,
    { margin: 10, scale: 1 },
    (err: Error, url: string) => {
      t.ok(!err, "Should not generate errors with options param");

      t.type(url, "string", "Should return a string");

      t.equal(
        url.split(",")[0],
        "data:image/png;base64",
        "Should have correct header",
      );

      const b64png = url.split(",")[1];
      t.equal(b64png.length % 4, 0, "Should have a correct length");
    },
  );
});

test("PNG renderToFile", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });
  const fileName = "qrimage.png";
  let fsStub = sinon.stub(fs, "createWriteStream");
  fsStub.returns(new StreamMock());

  t.plan(5);

  PngRenderer.renderToFile(fileName, sampleQrData, (err: Error) => {
    t.ok(!err, "Should not generate errors with only qrData param");

    t.equal(
      fsStub.getCall(0).args[0],
      fileName,
      "Should save file with correct file name",
    );
  });

  PngRenderer.renderToFile(
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
  fsStub = sinon.stub(fs, "createWriteStream");
  fsStub.returns(new StreamMock().forceErrorOnWrite());

  PngRenderer.renderToFile(fileName, sampleQrData, function(err) {
    t.ok(err, "Should fail if error occurs during save");
  });

  fsStub.restore();
});

test("PNG renderToFileStream", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });

  t.doesNotThrow(() => {
    PngRenderer.renderToFileStream(new StreamMock(), sampleQrData);
  }, "Should not throw with only qrData param");

  t.doesNotThrow(() => {
    PngRenderer.renderToFileStream(new StreamMock(), sampleQrData, {
      margin: 10,
      scale: 1,
    });
  }, "Should not throw with options param");

  t.end();
});
