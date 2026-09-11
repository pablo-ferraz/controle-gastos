// Gera os ícones do PWA (public/icons/*.png) como PNGs sólidos desenhados
// via pixels, sem dependências externas de imagem. Rodar com:
//   node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const BG = hexToRgb('#2a78d6'); // categoria 1 (azul)
const CARD = [255, 255, 255];
const COIN = hexToRgb('#eda100'); // categoria 4 (amarelo)

function roundedRectContains(x, y, rect) {
  const { x0, x1, y0, y1, radius } = rect;
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  if (x >= x0 + radius && x <= x1 - radius) return true;
  if (y >= y0 + radius && y <= y1 - radius) return true;
  const rx = Math.min(Math.max(x, x0 + radius), x1 - radius);
  const ry = Math.min(Math.max(y, y0 + radius), y1 - radius);
  const dx = x - rx;
  const dy = y - ry;
  return dx * dx + dy * dy <= radius * radius;
}

function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  const cardRect = {
    x0: cx - size * 0.31,
    x1: cx + size * 0.31,
    y0: cy - size * 0.25,
    y1: cy + size * 0.17,
    radius: size * 0.06,
  };
  const coinR = size * 0.16;
  const coinCx = cardRect.x1 - size * 0.03;
  const coinCy = cardRect.y1 + size * 0.01;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let color = BG;
      if (roundedRectContains(x + 0.5, y + 0.5, cardRect)) {
        color = CARD;
      }
      const dx = x + 0.5 - coinCx;
      const dy = y + 0.5 - coinCy;
      if (dx * dx + dy * dy <= coinR * coinR) {
        color = COIN;
      }
      const idx = (y * size + x) * 4;
      pixels[idx] = color[0];
      pixels[idx + 1] = color[1];
      pixels[idx + 2] = color[2];
      pixels[idx + 3] = 255;
    }
  }
  return pixels;
}

function encodePNG(size) {
  const pixels = drawIcon(size);
  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0;
    pixels.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4);
  }
  const compressed = deflateSync(raw, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', encodePNG(192));
writeFileSync('public/icons/icon-512.png', encodePNG(512));
writeFileSync('public/icons/icon-512-maskable.png', encodePNG(512));
writeFileSync('public/icons/apple-touch-icon.png', encodePNG(180));
console.log('Ícones gerados em public/icons/.');
