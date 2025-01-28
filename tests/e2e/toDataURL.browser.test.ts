import { type Canvas, createCanvas } from "canvas";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { Qrex } from "../../src/qrex.browser";
import type { QrexOptions } from "../../src/types/qrex.type";

const defaultOptions: QrexOptions = {
  maskPattern: 0,
  version: 1,
  errorCorrectionLevel: "L",
};

describe("Qrex toDataURL Feature", () => {
  let canvasEl: HTMLCanvasElement | Canvas | undefined;
  let originalDocument: typeof global.document;

  beforeAll(() => {
    originalDocument = global.document;
    global.document = {
      createElement: (el: string) => {
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
    canvasEl = undefined;
  });

  it("should throw an error if no arguments are provided", async () => {
    expect(() => {
      // @ts-ignore - Testing invalid arguments
      const qrex: Qrex = new Qrex();
      qrex.toDataURL();
    }).toThrow("String required as first argument");
  });

  it("should throw an error if no arguments are provided (browser)", async () => {
    expect(() => {
      // @ts-ignore - Testing invalid arguments
      const qrex: Qrex = new Qrex();
      qrex.toDataURL();
    }).toThrow("String required as first argument");
  });

  it("should throw an error if text is not provided (browser)", async () => {
    expect(() => {
      // @ts-ignore - Testing invalid arguments
      const qrex: Qrex = new Qrex();
      qrex.toDataURL();
    }).toThrow("String required as first argument");
  });

  it("should generate a valid Data URL using promise with error correction level L", async () => {
    const qrex = new Qrex(
      "i am a pony!",
      {
        maskPattern: 0,
        errorCorrectionLevel: "L",
        version: 1,
      },
      canvasEl as HTMLCanvasElement,
    );

    const dataURL = qrex.toDataURL();
    expect(dataURL.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("should reject promise with error correction level H", async () => {
    const qrex = new Qrex(
      "i am a pony!",
      {
        version: 3,
        errorCorrectionLevel: "H",
        maskPattern: 0,
      },
      canvasEl as HTMLCanvasElement,
    );

    await expect(() => qrex.toDataURL()).toBeUndefined;
  });

  it("should create a canvas element when no canvas is provided", async () => {
    global.document = {
      createElement: (el: string) => {
        if (el === "canvas") {
          return createCanvas(200, 200);
        }
      },
    } as unknown as Document;

    const qrex = new Qrex("i am a pony!", {
      ...defaultOptions,
      errorCorrectionLevel: "H",
      version: 5,
    });

    const dataURL = qrex.toDataURL();
    expect(dataURL.startsWith("data:image/png;base64,")).toBe(true);
  });
});
