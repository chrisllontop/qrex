import { beforeEach, describe, expect, it } from "vitest";
import { Qrex } from "../../../../src/core/qrex";
import { TerminalSmall } from "../../../../src/renderer/terminal/terminal-small";
import type { QRData } from "../../../../src/types/qrex.type";

const renderer = new TerminalSmall();

describe("TerminalSmall interface", () => {
  it("should have render function", () => {
    expect(typeof renderer.render).toBe("function");
  });
});

describe("TerminalSmall render", () => {
  const sampleQrData: QRData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str: string;

  it("should not throw with only qrData param", () => {
    expect(() => {
      str = renderer.render(sampleQrData);
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should contain ANSI escape codes for colors", () => {
    expect(str).toContain("\x1b[");
  });

  it("should contain reset code at the end", () => {
    expect(str).toMatch(/\x1b\[0m$/);
  });

  it("should contain block characters", () => {
    expect(str).toMatch(/[█▀▄ ]/);
  });
});

describe("TerminalSmall render with inverse option", () => {
  const sampleQrData: QRData = Qrex.create("sample text", {
    version: 2,
    maskPattern: 0,
  });
  let str: string;

  it("should not throw with inverse option", () => {
    expect(() => {
      str = renderer.render(sampleQrData, {
        renderConfig: {
          inverse: true,
        },
      });
    }).not.toThrow();
  });

  it("should return a string", () => {
    expect(typeof str).toBe("string");
  });

  it("should contain ANSI escape codes for colors", () => {
    expect(str).toContain("\x1b[");
  });

  it("should contain reset code at the end", () => {
    expect(str).toMatch(/\x1b\[0m$/);
  });

  it("should contain block characters", () => {
    expect(str).toMatch(/[█▀▄ ]/);
  });
});

describe("TerminalSmall render with different QR sizes", () => {
  it("should handle version 1 QR code", () => {
    const qrData = Qrex.create("test", {
      version: 1,
      maskPattern: 0,
    });
    expect(() => renderer.render(qrData)).not.toThrow();
  });

  it("should handle version 40 QR code", () => {
    const qrData = Qrex.create("test".repeat(100), {
      version: 40,
      maskPattern: 0,
    });
    expect(() => renderer.render(qrData)).not.toThrow();
  });
});

describe("TerminalSmall render output structure", () => {
  const qrData = Qrex.create("test", {
    version: 1,
    maskPattern: 0,
  });
  let output: string;

  beforeEach(() => {
    output = renderer.render(qrData);
  });

  it("should start with color setup", () => {
    expect(output).toMatch(/^\x1b\[\d+m/);
  });

  it("should have proper line endings", () => {
    const lines = output.split("\n");
    expect(lines.length).toBeGreaterThan(1);
    lines.slice(0, -1).forEach(line => {
      expect(line).toMatch(/\x1b\[0m$/);
    });
  });
});
