import { type DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import sinon from "sinon";
import QRCode from "src";
import StreamMock from "test/mocks/writable-stream";

test("toFileStream png", (t: AssertionHandler) {
  t.throw(() => {
    QRCode.toFileStream("some text");
  }, "Should throw if stream is not provided");

  t.throw(() => {
    QRCode.toFileStream(new StreamMock());
  }, "Should throw if text is not provided");

  const fstream = new StreamMock();
  const spy = sinon.spy(fstream, "emit");

  QRCode.toFileStream(fstream, "i am a pony!");

  QRCode.toFileStream(fstream, "i am a pony!", {
    type: "image/png",
  });

  t.ok(spy.neverCalledWith("error"), "There should be no error");

  spy.restore();
  t.end();
});

test("toFileStream png with write error", (t: AssertionHandler) {
  const fstreamErr = new StreamMock().forceErrorOnWrite();
  QRCode.toFileStream(fstreamErr, "i am a pony!");

  t.plan(2);

  fstreamErr.on("error", (err: Error) => {
    t.ok(err, "Should return an error");
  });
});

test("toFileStream png with qrcode error", (t: AssertionHandler) => {
  const fstreamErr = new StreamMock();
  const bigString = Array(200).join("i am a pony!");

  t.plan(2);

  fstreamErr.on("error", (err: Error) => {
    t.ok(err, "Should return an error");
  });

  QRCode.toFileStream(fstreamErr, bigString);
  QRCode.toFileStream(fstreamErr, "i am a pony!", {
    version: 1, // force version=1 to trigger an error
    errorCorrectionLevel: "H",
  });
});
