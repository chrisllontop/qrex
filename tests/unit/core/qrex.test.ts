import { describe, expect, it } from "vitest";
import toSJIS from "../../../helper/to-sjis";
import { ECLevel } from "../../../src/core/error-correction-level";
import { QRex as QRCode } from "../../../src/core/qrex";
import { Version } from "../../../src/core/version";
import type { ErrorCorrectionLevel, MaskPatternType, SegmentInterface } from "../../../src/types/qrex.type";
//@ts-ignore
describe("QRCode Interface", () => {
  const defaultOptions = {
    maskPattern: 0 as MaskPatternType,
    errorCorrectionLevel: "M" as ErrorCorrectionLevel,
  };
  it("Should have 'create' function", () => {
    expect(typeof QRCode.create).toBe("function");
  });

  it("Should throw if no data is provided", () => {
    expect(() => QRCode.create()).toThrow();
  });

  it("Should not throw when valid data is provided", () => {
    expect(() => QRCode.create("1234567", defaultOptions)).not.toThrow();
  });

  it("Should return correct QR code properties", () => {
    const qr = QRCode.create("a123456A", {
      version: 1,
      maskPattern: 1,
      errorCorrectionLevel: "H",
    });
    expect(qr.modules.size).toBe(21);
    expect(qr.maskPattern).toBe(1);

    const darkModule = qr.modules.get(qr.modules.size - 8, 8);
    expect(darkModule).toBe(true);
  });

  it("Should throw if invalid data is passed", () => {
    //@ts-ignore
    expect(() => QRCode.create({})).toThrow();
  });

  it("Should accept data as string", () => {
    expect(() => QRCode.create("AAAAA00000", { version: 5, maskPattern: 0 })).not.toThrow();
  });

  it("Should accept data as array of objects", () => {
    expect(() => {
      //@ts-ignore
      QRCode.create(
        [
          { data: "ABCDEFG", mode: "alphanumeric" },
          { data: "abcdefg" },
          { data: "晒三", mode: "kanji" },
          { data: "0123456", mode: "numeric" },
        ] as SegmentInterface[],
        //@ts-ignore
        { toSJISFunc: toSJIS, maskPattern: 0, version: 4 },
      );
    }).not.toThrow();
  });

  it("Should accept errorCorrectionLevel as string", () => {
    expect(() =>
      QRCode.create("AAAAA00000", {
        errorCorrectionLevel: "quartile",
        maskPattern: 0,
      }),
    ).not.toThrow();
    expect(() =>
      QRCode.create("AAAAA00000", {
        errorCorrectionLevel: "Q",
        maskPattern: 0,
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
          const qr = QRCode.create("ABCDEFG", {
            errorCorrectionLevel: ecName as ErrorCorrectionLevel,
            maskPattern: 0,
          });
          expect(qr.errorCorrectionLevel).toEqual(level);
        }).not.toThrow();

        expect(() => {
          const qr = QRCode.create("ABCDEFG", {
            errorCorrectionLevel: ecName.toUpperCase() as ErrorCorrectionLevel,
            maskPattern: 0,
          });
          expect(qr.errorCorrectionLevel).toEqual(level);
        }).not.toThrow();
      }
    }
  });

  it("Should set default error correction level to M", () => {
    const qr = QRCode.create("ABCDEFG", { maskPattern: 0 });
    expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
  });
});

describe("QRCode Version", () => {
  it("Should create QR code with correct version", () => {
    const qr = QRCode.create("data", {
      version: 9,
      errorCorrectionLevel: ECLevel.M,
      maskPattern: 0,
    });
    expect(qr.version).toBe(9);
    expect(qr.errorCorrectionLevel).toBe(ECLevel.M);
  });

  it("Should throw if data cannot be contained with chosen version", () => {
    expect(() => {
      //@ts-ignore
      QRCode.create(new Array(Version.getCapacity(2, ECLevel.H)).join("a"), {
        version: 1,
        errorCorrectionLevel: ECLevel.H,
        maskPattern: 0,
      });
    }).toThrow();

    expect(() => {
      QRCode.create(
        //@ts-ignore
        new Array(Version.getCapacity(40, ECLevel.H) + 2).join("a"),
        {
          version: 40,
          errorCorrectionLevel: ECLevel.H,
          maskPattern: 0,
        },
      );
    }).toThrow();
  });

  it("Should use best version if the one provided is invalid", () => {
    expect(() => {
      QRCode.create("abcdefg", { version: undefined, maskPattern: 0 });
    }).not.toThrow();
  });
});

describe("QRCode Capacity", () => {
  it("Should contain 7 byte characters", () => {
    const qr = QRCode.create([{ data: "abcdefg", mode: "byte" } as SegmentInterface], {
      maskPattern: 0,
    });
    expect(qr.version).toBe(1);
  });

  it("Should contain 17 numeric characters", () => {
    const qr = QRCode.create([{ data: "12345678901234567", mode: "numeric" } as SegmentInterface], {
      maskPattern: 0,
    });
    expect(qr.version).toBe(1);
  });

  it("Should contain 10 alphanumeric characters", () => {
    const qr = QRCode.create([{ data: "ABCDEFGHIL", mode: "alphanumeric" } as SegmentInterface], {
      maskPattern: 0,
    });
    expect(qr.version).toBe(1);
  });

  it("Should contain 4 kanji characters", () => {
    const qr = QRCode.create([{ data: "ＡＩぐサ", mode: "kanji" } as SegmentInterface], {
      //@ts-ignore
      toSJISFunc: toSJIS,
      maskPattern: 0,
    });
    expect(qr.version).toBe(1);
  });
});
