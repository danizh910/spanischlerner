// Dependency-free PWA icon generator: hand-rolled PNG encoder (zlib from
// Node core + a small CRC32 implementation) so the repo doesn't need a
// native image library (sharp/canvas) just to ship two static icons.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/icons");
// Next.js file convention: a static apple-icon.png directly in app/ is
// auto-served at /apple-icon.png with the right <link rel="apple-touch-icon">
// tag, no metadata wiring needed. iOS ignores manifest.json icons, so this
// is required (separately from public/icons/*) for "Zum Home-Bildschirm".
const APPLE_ICON_PATH = path.resolve(__dirname, "../src/app/apple-icon.png");

const BG = [0x12, 0x12, 0x16]; // dark background matching the app theme
const FG = [0xe7, 0xb0, 0x08]; // warm accent for the monogram

// 5x7 bitmap font, 1 = filled pixel.
const FONT = {
  E: ["11111", "1....", "1....", "1111.", "1....", "1....", "11111"],
  S: [".1111", "1....", "1....", ".111.", "....1", "....1", "1111."],
};

function buildCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = buildCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk("IHDR", ihdrData);

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // no filter
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = chunk("IDAT", deflateSync(raw));

  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    rgba[i * 4] = BG[0];
    rgba[i * 4 + 1] = BG[1];
    rgba[i * 4 + 2] = BG[2];
    rgba[i * 4 + 3] = 255;
  }

  const setPixel = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    rgba[i] = color[0];
    rgba[i + 1] = color[1];
    rgba[i + 2] = color[2];
    rgba[i + 3] = 255;
  };

  const letters = ["E", "S"];
  const cols = 5;
  const rows = 7;
  const gap = 1; // columns of empty space between letters
  const totalCols = cols * letters.length + gap * (letters.length - 1);
  const scale = Math.floor((size * 0.62) / totalCols);
  const contentW = totalCols * scale;
  const contentH = rows * scale;
  const offsetX = Math.floor((size - contentW) / 2);
  const offsetY = Math.floor((size - contentH) / 2);

  letters.forEach((letter, letterIndex) => {
    const pattern = FONT[letter];
    const letterOffsetX = offsetX + letterIndex * (cols + gap) * scale;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (pattern[row][col] !== "1") continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            setPixel(
              letterOffsetX + col * scale + dx,
              offsetY + row * scale + dy,
              FG,
            );
          }
        }
      }
    }
  });

  return encodePng(size, size, rgba);
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const size of [192, 512]) {
    const png = drawIcon(size);
    const outPath = path.join(OUT_DIR, `icon-${size}.png`);
    writeFileSync(outPath, png);
    console.log(`Geschrieben: ${outPath} (${png.length} Bytes)`);
  }

  const appleIcon = drawIcon(180);
  writeFileSync(APPLE_ICON_PATH, appleIcon);
  console.log(`Geschrieben: ${APPLE_ICON_PATH} (${appleIcon.length} Bytes)`);
}

main();
