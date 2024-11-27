import { createCanvas } from "canvas";
import { afterAll, beforeAll, describe, expect, it, beforeEach, afterEach } from "vitest";
import { QRex } from "../../src/browser";
import type { QRexOptions } from "../../src/types/qrex.type";

const defaultOptions: QRexOptions = {
  maskPattern: 0,
  version: 1,
  errorCorrectionLevel: "L",
};

describe("QRex toDataURL Feature", () => {
  let canvasEl: HTMLCanvasElement;
  let originalDocument: typeof global.document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el: string): HTMLCanvasElement | undefined => {
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
    canvasEl = createCanvas(200, 200);
  });

  afterEach(() => {
    canvasEl = null;
  });

  it("should throw an error if no arguments are provided", async () => {
    expect(() => {
      const qrex: QRex = new QRex();
      qrex.toDataURL();
    }).toThrow("String required as first argument");
  });

  it("should throw an error if no arguments are provided (browser)", async () => {
    expect(() => {
      const qrex: QRex = new QRex();
      qrex.toDataURL();
    }).toThrow("String required as first argument");
  });

  it("should throw an error if text is not provided (browser)", async () => {
    expect(() => {
      const qrex: QRex = new QRex();
      qrex.toDataURL();
    }).toThrow("String required as first argument");
  });

  it("should generate a valid Data URL using promise with error correction level L", async () => {
    const qrex = new QRex(
      "i am a pony!",
      {
        maskPattern: 0,
        errorCorrectionLevel: "L",
        type: "image/png",
        version: 1,
      },
      canvasEl,
    );

    const dataURL = qrex.toDataURL();
    expect(dataURL.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("should reject promise with error correction level H", async () => {
    const qrex = new QRex(
      "i am a pony!",
      {
        version: 3,
        errorCorrectionLevel: "H",
        type: "image/png",
        maskPattern: 0,
      },
      canvasEl,
    );

    await expect(() => qrex.toDataURL()).toBeUndefined;
  });

  it("should create a canvas element when no canvas is provided", async () => {
    global.document = {
      createElement: (el) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    } as unknown as Document;

    const qrex = new QRex("i am a pony!", {
      ...defaultOptions,
      errorCorrectionLevel: "H",
      type: "image/png",
      version: 5,
    });

    const dataURL = qrex.toDataURL();
    expect(dataURL.startsWith("data:image/png;base64,")).toBe(true);
  });
});
