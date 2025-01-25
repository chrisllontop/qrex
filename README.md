# qrex
> Modern QR code generator for Node.js and Browser

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI](#cli)
  - [Browser](#browser)
  - [NodeJS](#nodejs)
  - [ES6/ES7](#es6es7)
- [Error correction level](#error-correction-level)
- [QR Code capacity](#qr-code-capacity)
- [Encoding Modes](#encoding-modes)
  - [Mixed modes](#mixed-modes)
  - [Auto mode](#auto-mode)
  - [Manual mode](#manual-mode)
  - [Kanji mode](#kanji-mode)
- [Binary data](#binary-data)
- [Multibyte characters](#multibyte-characters)
- [API](#api)
  - [Browser API](#browser-api)
  - [Server API](#server-api)
  - [Options](#options)
- [License](#license)

## Features
- 🌐 Universal - Works in Node.js, Browsers and React Native (via SVG)
- 🎨 Multiple formats - PNG, SVG, Terminal output, and more
- 📦 ESM first - Modern ES modules support
- 🔤 Multi-encoding - Supports Numeric, Alphanumeric, Kanji and Byte modes
- 🌏 International - Full UTF-8 support including emoji
- ⚡ Optimized - Auto generates optimal segments for best compression
- 📱 Compatible - QR codes readable by any standard scanner

## Installation
Inside your project folder do:

```shell
npm install --save qrex
```

or, install it globally to use `qrex` from the command line to save qrcode images or generate ones you can view in your terminal.

```shell
npm install -g qrex
```

## Usage
### CLI

```
Usage: qrex [options] <input string>

QR Code options:
  -v, --qversion  QR Code symbol version (1 - 40)                       [number]
  -e, --error     Error correction level           [choices: "L", "M", "Q", "H"]
  -m, --mask      Mask pattern (0 - 7)                                  [number]

Renderer options:
  -t, --type        Output type                  [choices: "png", "svg", "utf8"]
  -w, --width       Image width (px)                                    [number]
  -s, --scale       Scale factor                                        [number]
  -q, --qzone       Quiet zone size                                     [number]
  -l, --lightcolor  Light RGBA hex color
  -d, --darkcolor   Dark RGBA hex color
  --small  Output smaller QR code to terminal                          [boolean]

Options:
  -o, --output  Output file
  -h, --help    Show help                                              [boolean]
  --version     Show version number                                    [boolean]

Examples:
  qrex "some text"                    Draw in terminal window
  qrex -o out.png "some text"         Save as png image
  qrex -d F00 -o out.png "some text"  Use red as foreground color
```
If not specified, output type is guessed from file extension.<br>
Recognized extensions are `png`, `svg` and `txt`.

### Browser
`qrex` can be used in browser through modern bundlers like [Vite](https://vitejs.dev), [esbuild](https://esbuild.github.io), or [Rollup](https://rollupjs.org).

```javascript
// Using with React
import { Qrex } from 'qrex'
import { useEffect, useRef } from 'react'

function QRCode({ text }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const qr = new Qrex(text)
    qr.toCanvas(canvasRef.current)
  }, [text])

  return <canvas ref={canvasRef} />
}

// Using with vanilla JS
import { Qrex } from 'qrex'

const canvas = document.getElementById('canvas')
const qr = new Qrex('sample text')
qr.toCanvas(canvas)
```

### NodeJS
```javascript
import { Qrex } from 'qrex'

const qr = new Qrex('I am a pony!')
const url = await qr.toDataURL()
```

For terminal output:
```javascript
import { Qrex } from 'qrex'

const qr = new Qrex('I am a pony!', { type: 'terminal' })
const output = await qr.toString()
```

### ES6/ES7
```javascript 
import { Qrex } from 'qrex'

const generateQR = async (text) => {
  const qr = new Qrex(text)
  const url = await qr.toDataURL()
}

// Usage
await generateQR('Hello World!')
```

## Error correction level
Error correction capability allows to successfully scan a QR Code even if the symbol is dirty or damaged.
Four levels are available to choose according to the operating environment.

Higher levels offer a better error resistance but reduce the symbol's capacity.<br>
If the chances that the QR Code symbol may be corrupted are low (for example if it is showed through a monitor)
is possible to safely use a low error level such as `Low` or `Medium`.

Possible levels are shown below:

| Level            | Error resistance |
|------------------|:----------------:|
| **L** (Low)      | **~7%**          |
| **M** (Medium)   | **~15%**         |
| **Q** (Quartile) | **~25%**         |
| **H** (High)     | **~30%**         |

The percentage indicates the maximum amount of damaged surface after which the symbol becomes unreadable.

Error level can be set through `options.errorCorrectionLevel` property.<br>
If not specified, the default value is `M`.

```javascript
const qr = new Qrex('some text', { errorCorrectionLevel: 'H' })
const url = await qr.toDataURL()
console.log(url)
```

## QR Code capacity
Capacity depends on symbol version and error correction level. Also encoding modes may influence the amount of storable data.

The QR Code versions range from version **1** to version **40**.<br>
Each version has a different number of modules (black and white dots), which define the symbol's size.
For version 1 they are `21x21`, for version 2 `25x25` e so on.
Higher is the version, more are the storable data, and of course bigger will be the QR Code symbol.

The table below shows the maximum number of storable characters in each encoding mode and for each error correction level.

| Mode         | L    | M    | Q    | H    |
|--------------|------|------|------|------|
| Numeric      | 7089 | 5596 | 3993 | 3057 |
| Alphanumeric | 4296 | 3391 | 2420 | 1852 |
| Byte         | 2953 | 2331 | 1663 | 1273 |
| Kanji        | 1817 | 1435 | 1024 | 784  |

**Note:** Maximum characters number can be different when using [Mixed modes](#mixed-modes).

QR Code version can be set through `options.version` property.<br>
If no version is specified, the more suitable value will be used. Unless a specific version is required, this option is not needed.

```javascript
const qr = new Qrex('some text', { version: 2 })
const url = await qr.toDataURL()
console.log(url)
```

## Encoding modes
Modes can be used to encode a string in a more efficient way.<br>
A mode may be more suitable than others depending on the string content.
A list of supported modes are shown in the table below:

| Mode         | Characters                                                | Compression                               |
|--------------|-----------------------------------------------------------|-------------------------------------------|
| Numeric      | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9                              | 3 characters are represented by 10 bits   |
| Alphanumeric | 0–9, A–Z (upper-case only), space, $, %, *, +, -, ., /, : | 2 characters are represented by 11 bits   |
| Kanji        | Characters from the Shift JIS system based on JIS X 0208  | 2 kanji are represented by 13 bits        |
| Byte         | Characters from the ISO/IEC 8859-1 character set          | Each characters are represented by 8 bits |

Choose the right mode may be tricky if the input text is unknown.<br>
In these cases **Byte** mode is the best choice since all characters can be encoded with it. (See [Multibyte characters](#multibyte-characters))<br>
However, if the QR Code reader supports mixed modes, using [Auto mode](#auto-mode) may produce better results.

### Mixed modes
Mixed modes are also possible. A QR code can be generated from a series of segments having different encoding modes to optimize the data compression.<br>
However, switching from a mode to another has a cost which may lead to a worst result if it's not taken into account.
See [Manual mode](#manual-mode) for an example of how to specify segments with different encoding modes.

### Auto mode
By **default**, automatic mode selection is used.<br>
The input string is automatically splitted in various segments optimized to produce the shortest possible bitstream using mixed modes.<br>
This is the preferred way to generate the QR Code.

For example, the string **ABCDE12345678?A1A** will be splitted in 3 segments with the following modes:

| Segment  | Mode         |
|----------|--------------|
| ABCDE    | Alphanumeric |
| 12345678 | Numeric      |
| ?A1A     | Byte         |

Any other combinations of segments and modes will result in a longer bitstream.<br>
If you need to keep the QR Code size small, this mode will produce the best results.

### Manual mode
If auto mode doesn't work for you or you have specific needs, is also possible to manually specify each segment with the relative mode.
In this way no segment optimizations will be applied under the hood.<br>
Segments list can be passed as an array of object:

```javascript
import { Qrex } from 'qrex'

const segments = [
  { data: 'ABCDEFG', mode: 'alphanumeric' },
  { data: '0123456', mode: 'numeric' }
]

const qr = new Qrex(segments)
const url = await qr.toDataURL()
console.log(url)
```

### Kanji mode
With kanji mode is possible to encode characters from the Shift JIS system in an optimized way.<br>
Unfortunately, there isn't a way to calculate a Shifted JIS values from, for example, a character encoded in UTF-8, for this reason a conversion table from the input characters to the SJIS values is needed.<br>
This table is not included by default in the bundle to keep the size as small as possible.

If your application requires kanji support, you will need to pass a function that will take care of converting the input characters to appropriate values.

An helper method is provided by the lib through an optional file that you can include as shown in the example below.

**Note:** Support for Kanji mode is only needed if you want to benefit of the data compression, otherwise is still possible to encode kanji using Byte mode (See [Multibyte characters](#multibyte-characters)).

```javascript
import { Qrex } from 'qrex'
import { toSJIS } from 'qrex/helper/to-sjis'

const qr = new Qrex(kanjiString, { toSJISFunc: toSJIS })
const url = await qr.toDataURL()
console.log(url)
```

## Binary data
QR Codes can hold arbitrary byte-based binary data. If you attempt to create a binary QR Code by first converting the data to a JavaScript string, it will fail to encode properly because string encoding adds additional bytes. Instead, you must pass a [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) or compatible array, or a Node [Buffer](https://nodejs.org/api/buffer.html), as follows:

```javascript
// Regular array example
import { Qrex } from 'qrex'

const binaryData = [{ data: [253,254,255], mode: 'byte' }]
const qr = new Qrex(binaryData)
await qr.toFile('foo.png')
console.log('QR code saved!')
```

```javascript
// Uint8ClampedArray example
import { Qrex } from 'qrex'

const binaryData = [{ 
  data: new Uint8ClampedArray([253,254,255]), 
  mode: 'byte' 
}]
const qr = new Qrex(binaryData)
await qr.toFile('foo.png')
console.log('QR code saved!')
```

```javascript
// Node Buffer example
import { Buffer } from 'node:buffer'
import { Qrex } from 'qrex'

const binaryData = [{ 
  data: Buffer.from([253,254,255]), 
  mode: 'byte' 
}]
const qr = new Qrex(binaryData)
await qr.toFile('foo.png')
```

## Multibyte characters
Support for multibyte characters isn't present in the initial QR Code standard, but is possible to encode UTF-8 characters in Byte mode.

QR Codes provide a way to specify a different type of character set through ECI (Extended Channel Interpretation), but it's not fully implemented in this lib yet.

Most QR Code readers, however, are able to recognize multibyte characters even without ECI.

Note that a single Kanji/Kana or Emoji can take up to 4 bytes.

## API
Browser:
- [constructor()](#constructor)
- [toCanvas()](#tocanvas)
- [toDataURL()](#todataurl)
- [toString()](#tostring)

Server:
- [constructor()](#constructor)
- [toCanvas()](#tocanvas)
- [toDataURL()](#todataurl)
- [toString()](#tostring)
- [toFile()](#tofile)
- [toFileStream()](#tofilestream)

### Browser API
#### `constructor(text, [options])`
Creates a new Qrex instance.

##### `text`
Type: `String|Array`

Text to encode or a list of objects describing segments.

##### `options`
See [QR Code options](#qr-code-options).

##### Example
```javascript
const qr = new Qrex('Hello World', { errorCorrectionLevel: 'H' })
```

#### `toCanvas([canvasElement])`
Draws QR code symbol to canvas. Returns a Promise that resolves with the canvas element.
If `canvasElement` is omitted a new canvas is created.

##### Example
```javascript
const qr = new Qrex('Hello World')
await qr.toCanvas(document.getElementById('canvas'))
```

#### `toDataURL()`
Returns a Promise that resolves with a Data URI containing a representation of the QR Code image.

##### Example
```javascript
const qr = new Qrex('Hello World', {
  // QR Code options
  errorCorrectionLevel: 'H',
  
  // Render options
  render: {
    margin: 1,
    color: {
      dark: "#010599FF",
      light: "#FFBF60FF"
    }
  }
})

// Specify image type and quality in renderConfig
const url = await qr.toDataURL({
  type: 'image/jpeg',
  renderConfig: {
    quality: 0.3
  }
})
document.getElementById('image').src = url
```

#### `toString()`
Returns a Promise that resolves with a string representation of the QR Code.

##### Example
```javascript
const qr = new Qrex('Hello World', { type: 'terminal' })
const str = await qr.toString()
```

### Server API
#### `toFile(path)`
Writes QR Code image to file. Returns a Promise.

##### Example
```javascript
const qr = new Qrex('Hello World')
await qr.toFile('foo.png')
```

#### `toFileStream(stream)`
Writes QR Code image to stream. Only works with `png` format for now.

##### Example
```javascript
import { createWriteStream } from 'node:fs'
import { Qrex } from 'qrex'

const qr = new Qrex('Hello World')
const out = createWriteStream('foo.png')
await qr.toFileStream(out)
```

### Options

Qrex provides a flexible configuration system that allows you to customize both the QR code generation and its visual representation. Options can be defined in two ways:

1. **Global Configuration**: Through the `options` parameter in the constructor
   - QR Code options are defined at the root level
   - Render options are defined under the `render` property
2. **Per-Method Configuration**: Directly in render methods

#### QR Code Options

These options control the fundamental aspects of QR code generation and are defined at the root level of the options object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `version` | `Number` | `auto` | QR Code version (1-40). Higher versions can store more data but create larger codes |
| `errorCorrectionLevel` | `String` | `M` | Error correction capability (`L`: ~7%, `M`: ~15%, `Q`: ~25%, `H`: ~30%) |
| `maskPattern` | `Number` | `auto` | Pattern used to mask the symbol (0-7) |
| `toSJISFunc` | `Function` | `undefined` | Function for Kanji character conversion |
| `render` | `Object (RenderOptions)`  | `undefined` | Container for render options when defined globally |

#### Render Options

These options control the visual output and can be defined in two ways:
1. Under the `render` property in the global configuration
2. Directly in render methods to override global settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `margin` | `Number` | `4` | Quiet zone size in modules |
| `scale` | `Number` | `4` | Size of each module in pixels |
| `width` | `Number` | `undefined` | Force specific width (overrides scale) |
| `color.dark` | `String` | `#000000ff` | Color of dark modules (RGBA hex) |
| `color.light` | `String` | `#ffffffff` | Color of light modules (RGBA hex) |
| `renderConfig` | `Object` | `undefined` | Renderer-specific configuration options (e.g., PNG compression, terminal display, JPEG quality) |

#### Usage Examples

1. **Global Configuration**:
```javascript
const qr = new Qrex('Hello World', {
  // QR Code options at root level
  version: 5,
  errorCorrectionLevel: 'H',
  
  // Render options under 'render' property
  render: {
    margin: 2,
    scale: 8,
    color: {
      dark: '#010599FF',
      light: '#FFBF60FF'
    }
  }
})

// Uses global configuration
await qr.toCanvas()
```

2. **Per-Method Configuration Override**:
```javascript
const qr = new Qrex('Hello World')

// Override render options for specific method
await qr.toCanvas({
  margin: 2,
  scale: 8,
  color: {
    dark: '#010599FF',
    light: '#FFBF60FF'
  }
})
```

3. **Renderer-Specific Options**:
```javascript
// PNG-specific options
await qr.toFile('qr.png', {
  renderConfig: {
    deflateLevel: 9,
    filterType: 4
  }
})

// Terminal-specific options
await qr.toString({
  renderConfig: {
    small: true
  }
})

// JPEG quality for Canvas/DataURL
await qr.toDataURL({
  type: 'image/jpeg',
  renderConfig: {
    quality: 0.8
  }
})
```

## License
[MIT License](./LICENSE)

The word "QR Code" is registered trademark of:<br>
[DENSO WAVE INCORPORATED](https://www.denso-wave.com)
