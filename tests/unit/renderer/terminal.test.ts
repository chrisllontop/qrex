import type { DeprecatedAssertionSynonyms as AssertionHandler } from "tap";

import { test } from "tap";
import QRCode from "@core/qrcode";
import TerminalRenderer from "../../../src/renderer/terminal.js";

test("TerminalRenderer interface", (t: AssertionHandler) => {
  t.type(TerminalRenderer.render, "function", "Should have render function");

  t.end();
});

test("TerminalRenderer render big", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });
  let str;

  t.doesNotThrow(() => {
    str = TerminalRenderer.render(sampleQrData);
  }, "Should not throw with only qrData param");

  t.doesNotThrow(() => {
    str = TerminalRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1,
    });
  }, "Should not throw with options param");

  t.type(str, "string", "Should return a string");

  t.doesNotThrow(() => {
    str = TerminalRenderer.render(sampleQrData, { inverse: true });
  }, "Should not throw with inverse options");

  t.type(str, "string", "Should return a string if inverse option is set");

  t.end();
});

test("TerminalRenderer render small", (t: AssertionHandler) => {
  const sampleQrData = QRCode.create("sample text", { version: 2 });
  let str;
  let calledCallback = false;
  const callback = () => {
    calledCallback = true;
  };

  t.doesNotThrow(() => {
    str = TerminalRenderer.render(sampleQrData);
  }, "Should not throw with only qrData param");

  t.doesNotThrow(() => {
    str = TerminalRenderer.render(sampleQrData, {
      margin: 10,
      scale: 1,
      small: true,
    });
  }, "Should not throw with options param and without callback");

  t.doesNotThrow(() => {
    str = TerminalRenderer.render(
      sampleQrData,
      {
        margin: 10,
        scale: 1,
        small: true,
      },
      callback,
    );
  }, "Should not throw with options param and callback");

  t.type(str, "string", "Should return a string");

  t.equal(calledCallback, true, "string", "Should call a callback");

  t.notThrow(() => {
    str = TerminalRenderer.render(sampleQrData, { small: true, inverse: true });
  }, "Should not throw with inverse options");

  t.type(str, "string", "Should return a string if inverse option is set");

  t.end();
});
