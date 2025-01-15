import { describe, expect, it } from "vitest";
import { ECLevel } from "../../../src/core/error-correction-level";
import { Qrex } from "../../../src/core/qrex";
import { Version } from "../../../src/core/version";
import type { QrContent, MaskPatternType, ErrorCorrectionLevelString } from "../../../src/types/qrex.type";

describe("QRCode Interface", () => {
  const defaultOptions = {
    maskPattern: 0 as MaskPatternType,
    errorCorrectionLevel: "M" as ErrorCorrectionLevelString,
    version: 1,
  };
  it("Should have 'create' function", () => {
    expect(typeof Qrex.create).toBe("function");
  });

  it("Should throw if no data is provided", () => {
    expect(() => Qrex.create(undefined as unknown as QrContent)).toThrow("No input text");
  });

  it("Should not throw when valid data is provided", () => {
    expect(() => Qrex.create("1234567", defaultOptions)).not.toThrow();
  });

  it("Should return correct QR code properties", () => {
    const qr = Qrex.create("a123456A", {
      version: 1,
      maskPattern: 1,
      errorCorrectionLevel: "H",
    });

    expect(qr.modules.size).toBe(21);
    expect(qr.maskPattern).toBe(1);

    const darkModule = qr.modules.get(qr.modules.size - 8, 8);
    expect(darkModule).toBe(1);
  });

  it("Should throw if invalid data is passed", () => {
    expect(() => Qrex.create({} as QrContent)).toThrow("bad maskPattern:undefined");
  });
  it("Should accept data as string", () => {
    expect(() =>
      Qrex.create("AAAAA00000", {
        version: 5,
        maskPattern: 0,
      }),
    ).not.toThrow();
  });

  it("Should accept errorCorrectionLevel as string", () => {
    expect(() =>
      Qrex.create("AAAAA00000", {
        errorCorrectionLevel: "quartile",
        maskPattern: 0,
        version: 1,
      }),
    ).not.toThrow();
    expect(() =>
      Qrex.create("AAAAA00000", {
        errorCorrectionLevel: "q" as ErrorCorrectionLevelString,
        maskPattern: 0,
        version: 1,
      }),
    ).not.toThrow();
  });
});

describe("QRCode Error Correction", () => {
  const ecValues = [
    { name: ["l", "low"], level: ECLevel.L },
    { name: ["m", "medium"], level: ECLevel.M },
    { name: ["q", "quartile"], level: ECLevel.Q },
    { name: ["h", "high"], level: ECLevel.H },
  ];

  it("Should handle error correction levels correctly", () => {
    for (const { name, level } of ecValues) {
      for (const ecName of name) {
        expect(() => {
          const qr = Qrex.create("ABCDEFG", {
            errorCorrectionLevel: ecName as ErrorCorrectionLevelString,
            maskPattern: 0,
            version: 1,
          });
          expect(qr.errorCorrectionLevel).toEqual(level);
        }).not.toThrow();

        expect(() => {
          const qr = Qrex.create("ABCDEFG", {
            errorCorrectionLevel: ecName.toUpperCase() as ErrorCorrectionLevelString,
            maskPattern: 0,
            version: 1,
          });
          expect(qr.errorCorrectionLevel).toEqual(level);
        }).not.toThrow();
      }
    }
  });

  it("Should set default error correction level to M", () => {
    const qr = Qrex.create("ABCDEFG", { maskPattern: 0, version: 1 });
    expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
  });
});

describe("QRCode Version", () => {
  it("Should create QR code with correct version", () => {
    const qr = Qrex.create("data", {
      version: 9,
      errorCorrectionLevel: ECLevel.M,
      maskPattern: 0,
    });
    expect(qr.version).toBe(9);
    expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
  });

  it("Should throw if data cannot be contained with chosen version", () => {
    expect(() => {
      Qrex.create(new Array(Version.getCapacity(2, ECLevel.H, undefined)).join("a"), {
        version: 1,
        errorCorrectionLevel: ECLevel.H,
        maskPattern: 0,
      });
    }).toThrow();

    expect(() => {
      Qrex.create(new Array(Version.getCapacity(40, ECLevel.H, undefined) + 2).join("a"), {
        version: 40,
        errorCorrectionLevel: ECLevel.H,
        maskPattern: 0,
      });
    }).toThrow();
  });

  it("Should use best version if the one provided is invalid", () => {
    expect(() => {
      Qrex.create("abcdefg", { version: 41, maskPattern: 0 });
    }).toThrow("No valid version provided");
  });
});
