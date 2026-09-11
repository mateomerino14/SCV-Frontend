const maxWidth = 1500;
const quality = 0.75;
const compressibleTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    image.src = dataUrl;
  });
}

function getTargetSize(width, height) {
  if (width <= maxWidth) {
    return {width, height};
  }
  return {width: maxWidth, height: Math.round((height * maxWidth) / width)};
}

export async function compressImage(file) {
  if (!file || !compressibleTypes.includes(file.type)) {
    return file;
  }
  try {
    const dataUrl = await readAsDataUrl(file);
    const image = await loadImage(dataUrl);
    const {width, height} = getTargetSize(image.width, image.height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) {
      return file;
    }
    const name = file.name.replace(/\.[^.]+$/, '.jpg');
    return new File([blob], name, {type: 'image/jpeg', lastModified: Date.now()});
  }
  catch {
    return file;
  }
}