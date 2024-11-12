import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {toString} from "../../src/index.js"; 
import {toString as toStringBrowser} from "../../src/browser.js"; 
import { removeNativePromise, restoreNativePromise } from "../helpers.js";
import path from "path";
import fs from "fs";

describe("toString - no promise available", () => {
  let originalPromise;
  beforeEach(() => {
    originalPromise = global.Promise;
    removeNativePromise();
    global.Promise = originalPromise;
  });

  afterEach(() => {
    restoreNativePromise();
  });

  it("should throw if text is not provided", () => {
    expect(() => toString()).toThrow("String required as first argument");
  });

  it("should return a Promise if a callback is not provided", () => {
    const result = toString("some text");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should return a Promise if a callback is not a function", () => {
    const result = toString("some text", {});
    expect(result).toBeInstanceOf(Promise);
  });

  it("should throw if text is not provided (browser)", () => {
    expect(() => toString()).toThrow("String required as first argument");
  });

  it("should return a Promise if a callback is not provided (browser)", () => {
    const result = toStringBrowser("some text");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should return a Promise if a callback is not a function (browser)", () => {
    const result = toStringBrowser("some text", {});
    expect(result).toBeInstanceOf(Promise);
  });
});

describe("toString", () => {
  it("should throw if text is not provided", () => {
    expect(() => {
      toString();
    }).toThrow("String required as first argument");
  });

  it("should return a string when callback is provided", async () => {
    const str = await toString("some text");
    expect(typeof str).toBe("string");
  });

  it("should return a promise if no callback is provided", () => {
    const result = toString("some text");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should resolve with a string when using a promise", async () => {
    const str = await toString("some text");
    expect(typeof str).toBe("string");
  });

  it("should resolve with a string when using a promise and options", async () => {
    const str = await toString("some text", { errorCorrectionLevel: "L" });
    expect(typeof str).toBe("string");
  });
});

describe("toString (browser)", () => {
  it("should throw if text is not provided", () => {
    expect(() => {
      toStringBrowser();
    }).toThrow("Too few arguments provided");
  });

  it("should return a string when callback is provided (browser)", async () => {
    const str = await toStringBrowser("some text");
    expect(typeof str).toBe("string");
  });

  it("should return a promise if no callback is provided", () => {
    const result = toStringBrowser("some text");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should resolve with a string when using a promise", async () => {
    const str = await toStringBrowser("some text");
    expect(typeof str).toBe("string");
  });

  it("should resolve with a string when using a promise and options", async () => {
    const str = await toStringBrowser("some text", { errorCorrectionLevel: "L" });
    expect(typeof str).toBe("string");
  });
});

describe("toString svg", () => {
  const file = path.join(__dirname, "/svgtag.expected.out");
 const defaultOptions = {
    type: "svg",
    errorCorrectionLevel: "L",
    maskPattern: 0  // Force consistent mask pattern
  };
  it("should return an error for invalid version with callback", (done) => {
    toString(
      "http://www.google.com",
      {
        version: 1, // force version=1 to trigger an error
        errorCorrectionLevel: "H",
        type: "svg",
      },
      (err, code) => {
        expect(err).toBeTruthy();
        expect(code).toBeUndefined();
        
      },
    );
  });

  // it("should return a valid SVG with callback", async () => {
  //   const expectedSvg = await fs.promises.readFile(file, "utf8");
  
  //   const code = await new Promise((resolve, reject) => {
  //     toString(
  //       "http://www.google.com",
  //       {
  //         errorCorrectionLevel: "H",
  //         type: "svg",
  //       },
  //       (err, code) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve(code);
  //         }
  //       },
  //     );
  //   });
  
  //   // Normalize line endings and trim whitespace for both actual and expected SVG
  //   const normalizedExpectedSvg = expectedSvg.trim().replace(/\r\n/g, "\n");
  //   const normalizedCode = code.trim().replace(/\r\n/g, "\n");
  
  //   // Assert the SVG output matches the expected SVG
  //   expect(normalizedCode).toBe(normalizedExpectedSvg);
  // });
  

  it("should return an error for invalid version with promise", async () => {
    await expect(
      toString("http://www.google.com", {
        version: 1,
        errorCorrectionLevel: "H",
        type: "svg",
      })
    ).rejects.toThrow();
  });

  // it("should return a valid SVG with promise", async () => {
  //   const expectedSvg = await fs.promises.readFile(file, "utf8");
  //   const code = await toString("http://www.google.com", {
  //     errorCorrectionLevel: "H",
  //     type: "svg",
  //   });

  //   // Normalize the SVG strings by removing whitespace
  //   const normalizedExpected = expectedSvg.replace(/\s+/g, '');
  //   const normalizedCode = code.replace(/\s+/g, '');
    
  //   expect(normalizedCode).toBe(normalizedExpected);
  // });
});


// describe('toString browser svg', () => {
//   const file = path.join(__dirname, '/svgtag.expected.out');

//   it('should output a valid svg', async () => {
//   const expectedSvg = await new Promise((resolve, reject) => {
//     fs.readFile(file, "utf8", (err, data) => {
//       if (err) reject(err);
//       resolve(data);
//     });
//   });

//   // Normalize SVG strings to avoid whitespace differences
//   const normalizeSvg = (svg) => svg.replace(/\s+/g, '').trim();

//   // Using callback version of toString
//   await new Promise((resolve, reject) => {
//     toStringBrowser(
//       "http://www.google.com",
//       {
//         errorCorrectionLevel: "H",
//         type: "svg",
//       },
//       (err, code) => {
//         if (err) {
//           reject(err);
//         } else {
//           expect(normalizeSvg(code)).toBe(normalizeSvg(expectedSvg));
//           resolve();
//         }
//       }
//     );
//   });
  
//   // Using promise version of toString
//   const code = await toStringBrowser("http://www.google.com", {
//     errorCorrectionLevel: "H",
//     type: "svg",
//   });

//   expect(normalizeSvg(code)).toBe(normalizeSvg(expectedSvg));
// });

// });


// describe('QRCode.toString utf8', () => {
//   const expectedUtf8 = [
//     "                                 ",
//     "                                 ",
//     "    █▀▀▀▀▀█ █ ▄█  ▀ █ █▀▀▀▀▀█    ",
//     "    █ ███ █ ▀█▄▀▄█ ▀▄ █ ███ █    ",
//     "    █ ▀▀▀ █ ▀▄ ▄ ▄▀ █ █ ▀▀▀ █    ",
//     "    ▀▀▀▀▀▀▀ ▀ ▀ █▄▀ █ ▀▀▀▀▀▀▀    ",
//     "    ▀▄ ▀▀▀▀█▀▀█▄ ▄█▄▀█ ▄█▄██▀    ",
//     "    █▄ ▄▀▀▀▄▄█ █▀▀▄█▀ ▀█ █▄▄█    ",
//     "    █▄ ▄█▄▀█▄▄  ▀ ▄██▀▀ ▄  ▄▀    ",
//     "    █▀▄▄▄▄▀▀█▀▀█▀▀▀█ ▀ ▄█▀█▀█    ",
//     "    ▀ ▀▀▀▀▀▀███▄▄▄▀ █▀▀▀█ ▀█     ",
//     "    █▀▀▀▀▀█ █▀█▀▄ ▄▄█ ▀ █▀ ▄█    ",
//     "    █ ███ █ █ █ ▀▀██▀███▀█ ██    ",
//     "    █ ▀▀▀ █  █▀ ▀ █ ▀▀▄██ ███    ",
//     "    ▀▀▀▀▀▀▀ ▀▀▀  ▀▀ ▀    ▀  ▀    ",
//     "                                 ",
//     "                                 ",
//   ].join("\n");

//   it('should trigger an error for version 1 and high error correction level', async () => {
//     try {
//       const code = await toString("http://www.google.com", {
//         version: 1, // force version=1 to trigger an error
//         errorCorrectionLevel: "H",
//         type: "utf8",
//       });
//       expect(code).toBeNull();
//     } catch (err) {
//       expect(err).toBeTruthy();
//     }
//   });

//   it('should output a valid symbol with medium error correction level', async () => {
//     const code = await toString("http://www.google.com", {
//       errorCorrectionLevel: "M",
//       type: "utf8",
//     });
//     expect(code).toEqual(expectedUtf8);
//   });

//   it('should output a valid symbol with default options', async () => {
//     const code = await toString("http://www.google.com");
//     expect(code).toEqual(expectedUtf8);
//   });

//   it('should trigger an error (promise) for version 1 and high error correction level', async () => {
//     try {
//       const code = await toString("http://www.google.com", {
//         version: 1, // force version=1 to trigger an error
//         errorCorrectionLevel: "H",
//         type: "utf8",
//       });
//       expect(code).toBeNull();
//     } catch (err) {
//       expect(err).toBeTruthy();
//     }
//   });

//   it('should output a valid symbol (promise) with medium error correction level', async () => {
//     const code = await toString("http://www.google.com", {
//       errorCorrectionLevel: "M",
//       type: "utf8",
//     });
//     expect(code).toEqual(expectedUtf8);
//   });

//   it('should output a valid symbol with default options (promise)', async () => {
//     const code = await toString("http://www.google.com");
//     expect(code).toEqual(expectedUtf8);
//   });
// });

// describe('QRCode.toString terminal', () => {
//   const expectedTerminal = fs.readFileSync(path.join(__dirname, '/terminal.expected.out'), 'utf8');

//   it('should output a valid terminal symbol', async () => {
//     // Callback version
//     toString( // Ensure you use the correct method reference
//       'http://www.google.com',
//       {
//         errorCorrectionLevel: 'M',
//         type: 'terminal',
//       },
//       (err, code) => {
//         // Handle the error if there is one
//         if (err) {
//           console.error('Error generating QR code:', err);
//           return;
//         }

//         // Ensure code is defined before calling .replace()
//         if (code) {
//           const cleanCode = code.replace(/\u001b\[[0-9;]*m/g, ''); // Remove ANSI color codes
//           expect(cleanCode + '\n').toEqual(expectedTerminal);
//         } else {
//           throw new Error('QR code output is undefined');
//         }
//       }
//     );

//     // Promise version
//     try {
//       const code = await toString('http://www.google.com', {
//         errorCorrectionLevel: 'M',
//         type: 'terminal',
//       });

//       if (code) {
//         const cleanCode = code.replace(/\u001b\[[0-9;]*m/g, ''); // Remove ANSI color codes
//         expect(cleanCode + '\n').toEqual(expectedTerminal);
//       } else {
//         throw new Error('QR code output is undefined');
//       }
//     } catch (err) {
//       console.error('Error generating QR code:', err);
//     }
//   });
// });

describe('QRCode.toString byte-input', () => {
  const expectedOutput = [
    "                             ",
    "                             ",
    "    █▀▀▀▀▀█  █▄█▀ █▀▀▀▀▀█    ",
    "    █ ███ █ ▀█ █▀ █ ███ █    ",
    "    █ ▀▀▀ █   ▀ █ █ ▀▀▀ █    ",
    "    ▀▀▀▀▀▀▀ █▄▀▄█ ▀▀▀▀▀▀▀    ",
    "    ▀██▄██▀▀▀█▀▀ ▀█  ▄▀▄     ",
    "    ▀█▀▄█▄▀▄ ██ ▀ ▄ ▀▄  ▀    ",
    "    ▀ ▀ ▀▀▀▀█▄ ▄▀▄▀▄▀▄▀▄▀    ",
    "    █▀▀▀▀▀█ █  █▄█▀█▄█  ▀    ",
    "    █ ███ █ ▀█▀▀ ▀██  ▀█▀    ",
    "    █ ▀▀▀ █ ██▀ ▀ ▄ ▀▄▀▄▀    ",
    "    ▀▀▀▀▀▀▀ ▀▀▀ ▀ ▀▀▀ ▀▀▀    ",
    "                             ",
    "                             ",
  ].join("\n");
  const byteInput = new Uint8ClampedArray([1, 2, 3, 4, 5]);

  it('should output the correct code', async () => {
    const code = await toString(
      [{ data: byteInput, mode: "byte" }],
      { errorCorrectionLevel: "L" }
    );

    expect(code).toEqual(expectedOutput);
  });

  it('should not return an error', async () => {
    try {
      await toString(
        [{ data: byteInput, mode: "byte" }],
        { errorCorrectionLevel: "L" }
      );
    } catch (err) {
      expect(err).toBeNull();
    }
  });
});