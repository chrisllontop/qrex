import { type Canvas, createCanvas } from "canvas";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Qrex } from "../../src/qrex.browser.js";
import type { QrexOptions } from "../../src/types/qrex.type.js";

const defaultOptions = {
  maskPattern: 0,
  version: 1,
};

describe("Qrex toCanvas Feature", () => {
  let canvasEl: HTMLCanvasElement;
  let originalDocument: typeof global.document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el: string): Canvas | undefined => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
        return undefined;
      },
    } as unknown as Document;
  });

  afterAll(() => {
    global.document = originalDocument;
  });

  beforeEach(() => {
    // @ts-ignore Testing with invalid canvas element
    canvasEl = createCanvas(200, 200);
  });

  afterEach(() => {
    // @ts-ignore Testing with invalid canvas element
    canvasEl = null;
  });

  it("should work with text and generate a canvas", () => {
    console.log("from test", canvasEl);
    const qrex: Qrex = new Qrex("test text", defaultOptions as QrexOptions, canvasEl);
    const canvas = qrex.toCanvas();

    expect(canvas).toBeDefined();
    expect(canvas).toHaveProperty("getContext");
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it("should work with canvas, text and callback", () => {
    return new Promise((resolve) => {
      const qrex: Qrex = new Qrex("test text", defaultOptions as QrexOptions, canvasEl);
      const canvas = qrex.toCanvas();
      expect(canvas).toBeDefined();
      resolve(undefined);
    });
  });

  it("should work with canvas, text, options and callback", () => {
    return new Promise((resolve) => {
      const options = { ...defaultOptions, width: 200 };
      const qrex: Qrex = new Qrex("test text", options as QrexOptions, canvasEl);
      const canvas = qrex.toCanvas();
      expect(canvas).toBeDefined();
      resolve(undefined);
    });
  });
});
