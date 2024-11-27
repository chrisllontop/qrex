import path from "node:path";
import { describe, expect, it } from "vitest";
import { QRex } from "../../src/server";

const baseOptions = {
  maskPattern: 0,
  version: 3,
};

describe("toString", () => {
  it("should throw if text is not provided", () => {
    expect(() => {
      const qrex: QRex = new QRex();
      qrex.toString();
    }).toThrow("String required as first argument");
  });
});

describe("toString svg", () => {
  const file = path.join(__dirname, "/svgtag.expected.out");

  it("should return an error for invalid version with callback", () => {
    const qrex: QRex = new QRex("http://www.google.com");
    expect(() => qrex.toString()).toThrow("bad maskPattern:undefined");
  });

  it("should return an error for invalid version with promise", async () => {
    const qrex: QRex = new QRex("http://www.google.com");
    expect(() => qrex.toString()).toThrow("bad maskPattern:undefined");
  });
});
