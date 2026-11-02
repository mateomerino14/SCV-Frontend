import {describe, it, expect} from 'vitest';
import ExcelJS from 'exceljs';
import {pngSizeOf, fitInside, signatureAnchor, columnPixels, strokeBoundsOf} from './excelSignature';

const pngOf = (width, height) => {
  const bytes = new Uint8Array(24);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);
  new DataView(bytes.buffer).setUint32(16, width);
  new DataView(bytes.buffer).setUint32(20, height);
  return `data:image/png;base64,${btoa(String.fromCharCode(...bytes))}`;
};

const sheetWith = (widths) => {
  const sheet = new ExcelJS.Workbook().addWorksheet('RENDICION');
  sheet.columns = widths.map((width) => ({width}));
  return sheet;
};

const leftPixelsOf = (sheet, {nativeCol, nativeColOff}) => {
  let pixels = nativeColOff / 9525;
  for (let column = 1; column <= nativeCol; column++) {
    pixels += columnPixels(sheet, column);
  }
  return pixels;
};

describe('Firma en la planilla de Excel', () => {
  it('lee el tamaño de la imagen PNG', () => {
    expect(pngSizeOf(pngOf(900, 300))).toEqual({width: 900, height: 300});
  });

  it('achica la firma sin deformarla', () => {
    expect(fitInside(900, 150, 190, 60)).toEqual({width: 190, height: 32});
    expect(fitInside(300, 300, 190, 60)).toEqual({width: 60, height: 60});
    expect(fitInside(80, 20, 190, 60)).toEqual({width: 80, height: 20});
  });

  it('centra la firma sobre su casillero aunque las columnas tengan anchos distintos', () => {
    const sheet = sheetWith([5, 12, 22, 42, 9, 14, 13, 15, 14]);
    [[1, 4], [6, 9]].forEach(([startCol, endCol]) => {
      const {tl, ext} = signatureAnchor(sheet, {startCol, endCol, firstRow: 20, lineRow: 24}, {width: 600, height: 150});
      let blockLeft = 0;
      for (let column = 1; column < startCol; column++) {
        blockLeft += columnPixels(sheet, column);
      }
      let blockWidth = 0;
      for (let column = startCol; column <= endCol; column++) {
        blockWidth += columnPixels(sheet, column);
      }
      const center = leftPixelsOf(sheet, tl) + ext.width / 2;
      expect(Math.abs(center - (blockLeft + blockWidth / 2))).toBeLessThanOrEqual(1);
    });
  });

  it('apoya la firma justo encima de la línea punteada', () => {
    const sheet = sheetWith([5, 12, 22, 42]);
    const {tl, ext} = signatureAnchor(sheet, {startCol: 1, endCol: 4, firstRow: 20, lineRow: 24}, {width: 600, height: 150});
    const rowHeight = 20;
    const bottom = (tl.nativeRow - 19) * rowHeight + tl.nativeRowOff / 9525 + ext.height;
    expect(Math.abs(bottom - 4 * rowHeight)).toBeLessThanOrEqual(1);
  });

  it('recorta el espacio vacío alrededor del trazo', () => {
    const width = 100;
    const height = 40;
    const pixels = new Uint8ClampedArray(width * height * 4);
    [[10, 20], [60, 25], [35, 12]].forEach(([x, y]) => {
      pixels[(y * width + x) * 4 + 3] = 255;
    });
    expect(strokeBoundsOf(pixels, width, height)).toEqual({left: 6, top: 8, right: 64, bottom: 29});
    expect(strokeBoundsOf(new Uint8ClampedArray(width * height * 4), width, height)).toBeNull();
  });
});
