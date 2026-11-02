const pngPrefix = 'data:image/png;base64,';
const pngWidthOffset = 16;
const pngHeightOffset = 20;
const alphaThreshold = 16;
const trimPadding = 4;
const digitWidthPx = 7;
const pointsToPixels = 4 / 3;
const defaultRowHeightPt = 15;
const emuPerPixel = 9525;
const signatureMaxWidth = 190;
const signatureMaxHeight = 60;
const signatureSidePadding = 10;

const bytesOf = (dataUrl) => {
  const binary = atob(dataUrl.slice(pngPrefix.length));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const readUint32 = (bytes, offset) => ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;

export const pngSizeOf = (dataUrl) => {
  const bytes = bytesOf(dataUrl);
  return {width: readUint32(bytes, pngWidthOffset), height: readUint32(bytes, pngHeightOffset)};
};

export const strokeBoundsOf = (pixels, width, height) => {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] > alphaThreshold) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < 0) {
    return null;
  }
  return {
    left: Math.max(left - trimPadding, 0),
    top: Math.max(top - trimPadding, 0),
    right: Math.min(right + trimPadding, width - 1),
    bottom: Math.min(bottom + trimPadding, height - 1),
  };
};

const canTrimInBrowser = () => typeof document !== 'undefined' && typeof createImageBitmap === 'function';

export const trimSignature = async (dataUrl) => {
  const original = {image: dataUrl, ...pngSizeOf(dataUrl)};
  if (!canTrimInBrowser()) {
    return original;
  }
  try {
    const bitmap = await createImageBitmap(new Blob([bytesOf(dataUrl)], {type: 'image/png'}));
    const source = document.createElement('canvas');
    source.width = bitmap.width;
    source.height = bitmap.height;
    const sourceContext = source.getContext('2d');
    sourceContext.drawImage(bitmap, 0, 0);
    const bounds = strokeBoundsOf(sourceContext.getImageData(0, 0, bitmap.width, bitmap.height).data, bitmap.width, bitmap.height);
    if (!bounds) {
      return original;
    }
    const width = bounds.right - bounds.left + 1;
    const height = bounds.bottom - bounds.top + 1;
    const cropped = document.createElement('canvas');
    cropped.width = width;
    cropped.height = height;
    cropped.getContext('2d').drawImage(source, bounds.left, bounds.top, width, height, 0, 0, width, height);
    return {image: cropped.toDataURL('image/png'), width, height};
  }
  catch {
    return original;
  }
};

export const fitInside = (width, height, maxWidth, maxHeight) => {
  if (!width || !height) {
    return {width: maxWidth, height: maxHeight};
  }
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  return {width: Math.round(width * scale), height: Math.round(height * scale)};
};

export const columnPixels = (sheet, column) => Math.round((sheet.getColumn(column).width || 10) * digitWidthPx);

export const rowPixels = (sheet, row) => Math.round((sheet.getRow(row).height || defaultRowHeightPt) * pointsToPixels);

const nativePosition = (sizeOf, start, offsetPx) => {
  let index = start;
  let remaining = Math.max(offsetPx, 0);
  while (remaining >= sizeOf(index)) {
    remaining -= sizeOf(index);
    index += 1;
  }
  return {index: index - 1, offset: Math.round(remaining * emuPerPixel)};
};

export const signatureAnchor = (sheet, {startCol, endCol, firstRow, lineRow}, size) => {
  let blockWidth = 0;
  for (let column = startCol; column <= endCol; column++) {
    blockWidth += columnPixels(sheet, column);
  }
  let spaceAbove = 0;
  for (let row = firstRow; row < lineRow; row++) {
    spaceAbove += rowPixels(sheet, row);
  }
  const ext = fitInside(size.width, size.height, Math.min(blockWidth - signatureSidePadding * 2, signatureMaxWidth), Math.min(spaceAbove, signatureMaxHeight));
  const column = nativePosition((index) => columnPixels(sheet, index), startCol, (blockWidth - ext.width) / 2);
  const row = nativePosition((index) => rowPixels(sheet, index), firstRow, spaceAbove - ext.height);
  return {tl: {nativeCol: column.index, nativeColOff: column.offset, nativeRow: row.index, nativeRowOff: row.offset}, ext};
};
