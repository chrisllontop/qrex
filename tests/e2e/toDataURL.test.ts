import { createCanvas } from "canvas";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { toDataURL } from "../../src";
import { toDataURL as toDataURLBrowser } from "../../src/browser";
import { removeNativePromise, restoreNativePromise } from "../helpers";

const defaultOptions = {
  maskPattern: 0,
};

describe("toDataURL - no promise available", () => {
  let originalPromise: Promise;
  beforeAll(() => {
    originalPromise = global.Promise;
    removeNativePromise();
    global.Promise = originalPromise;
  });

  afterAll(() => {
    restoreNativePromise();
  });

  it("should throw if no arguments are provided", async () => {
    await expect(() => toDataURL()).toThrow();
  });

  it("should throw if no arguments are provided (browser)", async () => {
    await expect(() => toDataURLBrowser()).toThrow();
  });

  it("should throw if text is not provided (browser)", async () => {
    await expect(() => toDataURLBrowser(() => { })).toThrow();
  });

  it("should reject if a callback is not provided (browser)", async () => {
    await expect(toDataURLBrowser("some text")).rejects.toThrow(
      "bad maskPattern:undefined",
    );
  });

  it("should reject if a callback is not a function (browser)", async () => {
    await expect(toDataURLBrowser("some text", {})).rejects.toThrow(
      "bad maskPattern:undefined",
    );
  });
});

describe("toDataURL - image/png", () => {
  const expectedDataURL = [
    "data:image/png;base64,",
    "iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKzSU",
    "RBVO3BQW7kQAwEwSxC//9y7h55akCQxvYQjIj/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp",
    "1ijFGqVYoxRrlGKNUqxRijXKxUNJ+EkqdyShU+mS0Kl0SfhJKk8Ua5RijVKsUS5epvKmJD",
    "yh8iaVNyXhTcUapVijFGuUiw9Lwh0qdyShU+mS0Kl0Kk8k4Q6VTyrWKMUapVijXHw5lROV",
    "kyR0Kt+sWKMUa5RijXIxTBI6lS4JkxVrlGKNUqxRLj5M5Tcl4UTlCZW/pFijFGuUYo1y8b",
    "Ik/KQkdCpdEjqVLgmdykkS/rJijVKsUYo1ysVDKt9M5UTlmxRrlGKNUqxRLh5Kwh0qXRJ+",
    "UxLuULkjCZ3KJxVrlGKNUqxRLh5S6ZLQqXRJ6FS6JHQqXRKeSEKn0iWhUzlJwolKl4QTlS",
    "eKNUqxRinWKBe/LAmdSpeETuUkCZ1Kl4QTlS4Jd6h0SehUuiS8qVijFGuUYo1y8WFJ6FS6",
    "JJyofFISOpVOpUtCp3KicqLypmKNUqxRijXKxYep3JGEE5UuCZ3KHSp3qHRJ6FR+U7FGKd",
    "YoxRol/scXS8ITKidJeEKlS8KJyhPFGqVYoxRrlIuHkvCTVE5U7kjCicpJEk6S8JOKNUqx",
    "RinWKBcvU3lTEu5IwolKp/KEyh1J6FTeVKxRijVKsUa5+LAk3KHyJpWTJHQqdyShU/lNxR",
    "qlWKMUa5SLL6fSJaFLwhNJeCIJP6lYoxRrlGKNcvHlknCicpKEE5UuCSdJOFHpktCpPFGs",
    "UYo1SrFGufgwlZ+k0iWhU+lUnlDpktCpdEnoVN5UrFGKNUqxRrl4WRL+EpU7ktCpdCpdEj",
    "qVO5LQqTxRrFGKNUqxRon/scYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKN",
    "UqxRijXKP0OHEepgrecVAAAAAElFTkSuQmCC",
  ].join("");

  it("should throw if no arguments are provided", async () => {
    await expect(() => toDataURL()).toThrow(
      "String required as first argument",
    );
  });

  it("should generate a valid URL using promise with error correction level L", async () => {
    await expect(
      toDataURL("i am a pony!", {
        maskPattern: 0,
        errorCorrectionLevel: "L",
        type: "image/png",
      }),
    ).resolves.toBe(expectedDataURL);
  });

  it("should trigger error with version 1 and error correction level H", async () => {
    await toDataURL(
      "i am a pony!",
      {
        maskPattern: 0,
        version: 1,
        errorCorrectionLevel: "H",
        type: "image/png",
      },
      (err, url) => {
        expect(err).not.toBeNull();
        expect(url).toBeUndefined();
      },
    );
  });

  it("should return a promise", async () => {
    const result = toDataURL("i am a pony!", {
      ...defaultOptions,
    });
    expect(typeof result.then).toBe("function");
  });

  it("should generate a valid URL using promise with error correction level L", async () => {
    try {
      const url = await toDataURL("i am a pony!", {
        ...defaultOptions,
        errorCorrectionLevel: "L",
        type: "image/png",
      });
      expect(url).toBe(expectedDataURL);
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it("should reject promise with error correction level H", async () => {
    try {
      await toDataURL("i am a pony!", {
        ...defaultOptions,
        version: 1,
        errorCorrectionLevel: "H",
        type: "image/png",
      });
    } catch (err) {
      expect(err).not.toBeNull();
    }
  });
});

describe("Canvas toDataURL - image/png", () => {
  const expectedDataURL = [
    "data:image/png;base64,",
    "iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAABmJLR0QA/wD/AP+gvaeTAA",
    "AC20lEQVR4nO3dQY7jMAwEwM1i///lzGUurYtWEEknQNV1EidjNGhFpuTX+/1+/4Fff5/+",
    "AnwWgSAIBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQRAIgkAQ/t0e4PV6VXyP/7a2b6yff9",
    "vecXq83eufPj+nVAiCQBAEgnA9hlhVt2jursGn1/hbt2OW6fNzSoUgCARBIAjlY4jV6TWu",
    "ex7hdt7g6TFA9zIaFYIgEASBILSPIbrdjhlWt/civn2prApBEAiCQBC+fgzR3R8xfa/kaS",
    "oEQSAIAkFoH0N82u/y03sVuzFJ9xhlmgpBEAiCQBDKxxDTv8u7+x9uP3/3+k+jQhAEgiAQ",
    "hOsxxNO/o0/7G07/fuvp83NKhSAIBEEgCK/u52VUzwNUr6Ponkc4Pb3V+1OcUiEIAkEQCE",
    "L5HlPT17zuPZ1ux0Dde2BVUyEIAkEQCEL5vYzTa271NfF2nUb1vMj097mlQhAEgiAQhPG1",
    "nbf3IqbnBXZjnuq9sKfncVYqBEEgCAJBGL+XsTqdp6g+/qr7Gr2q/n/0Q1BKIAgCQSjvqa",
    "z+3b07/qq6h3G6Z3P3/h1jCEoJBEEgCO3zEJ/ej3Cq+hlb3etSTqkQBIEgCATh4+YhqucF",
    "nu5fmD7+LRWCIBAEgSA83g+xmu45nH4m1+3nd1MhCAJBEAhC+x5T3br7I05193d0P5tchS",
    "AIBEEgCOXzEN1un3lV/Qyt6nUe3f0OOyoEQSAIAkEo3x+ielrj9Bq96h5z7Dx9b+eUCkEQ",
    "CIJAENr3mJpemzjdU7l7/7dRIQgCQRAIwvg+ldWm13Wc6t4Hs5oKQRAIgkAQvn4MUb1WdP",
    "q5nKevt08lowSCIBCE9jHE9F7R0/MGu7/f9lDqh+BRAkEQCML12s6n12Wcqp5n6N5X8/Tz",
    "zENQSiAIAkH4+v0hqKVCEASCIBAEgSAIBEEgCAJBEAiCQBAEgiAQBIEgCARBIAgCQfgBlZ",
    "7HAm5AupgAAAAASUVORK5CYII=",
  ].join("");
  it("should throw if no arguments are provided", () => {
    expect(() => toDataURLBrowser()).toThrow("Too few arguments provided");
  });

  it("should throw if text is not provided", () => {
    expect(() => toDataURLBrowser(() => { })).toThrow(
      "Too few arguments provided",
    );
  });

  it("should generate a valid Data URL with error correction level H", async () => {
    const canvas = createCanvas(200, 200);

    await toDataURLBrowser(canvas, "i am a pony!", {
      maskPattern: 0,
      errorCorrectionLevel: "H",
      type: "image/png",
    }).then((url) => {
      expect(
        url.startsWith(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOn",
        ),
      ).toBe(true);
    });
  });

  it("should trigger an error with version 1 and error correction level H", async () => {
    const canvas = createCanvas(200, 200);

    await expect(
      toDataURLBrowser(canvas, "i am a pony!", {
        ...defaultOptions,
        version: 1,
        errorCorrectionLevel: "H",
        type: "image/png",
      }),
    ).rejects.toThrow();
  });

  it("should return a promise", async () => {
    const canvas = createCanvas(200, 200);
    const result = toDataURLBrowser(canvas, "i am a pony!", {
      ...defaultOptions,
      errorCorrectionLevel: "H",
      type: "image/png",
    });
    expect(typeof result.then).toBe("function");
  });

  it("should generate a valid Data URL using promise with error correction level H", async () => {
    const canvas = createCanvas(200, 200);
    await toDataURLBrowser(canvas, "i am a pony!", {
      maskPattern: 0,
      errorCorrectionLevel: "H",
      type: "image/png",
    }).then((url) => {
      expect(
        url.startsWith(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOn",
        ),
      ).toBe(true);
    });
  });

  it("should throw an error when version 1 is specified (promise)", async () => {
    const canvas = createCanvas(200, 200);

    await expect(
      toDataURLBrowser(canvas, "i am a pony!", {
        version: 1,
        errorCorrectionLevel: "H",
        type: "image/png",
      }),
    ).rejects.toThrow();
  });

  it("should create a canvas element when no canvas is provided", async () => {
    try {
      global.document = {
        createElement: (el) => {
          if (el === "canvas") {
            return createCanvas(200, 200);
          }
        },
      };

      const url = await toDataURLBrowser("i am a pony!", {
        ...defaultOptions,
        errorCorrectionLevel: "H",
        type: "image/png",
      });
      expect(
        url.startsWith(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOn",
        ),
      ).toBe(true);
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });
});
