export interface FilterOptions {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  binarizeThreshold: number; // 0 to 255 (0 = disabled)
  denoise: boolean;
  sharpness: number;  // 0 to 100
  invert: boolean;
  rotationAngle: number; // -45 to +45 deg
}

export const DEFAULT_FILTERS: FilterOptions = {
  brightness: 10,
  contrast: 25,
  binarizeThreshold: 140,
  denoise: true,
  sharpness: 15,
  invert: false,
  rotationAngle: 0,
};

/**
 * Applies computer vision pre-processing pipeline on an HTML Image/Canvas
 */
export async function processImageCanvas(
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  filters: FilterOptions
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Failed to get 2D canvas context');

  const width = 'naturalWidth' in imageSource ? imageSource.naturalWidth : imageSource.width;
  const height = 'naturalHeight' in imageSource ? imageSource.naturalHeight : imageSource.height;

  canvas.width = width;
  canvas.height = height;

  // Handle Rotation if specified
  if (filters.rotationAngle !== 0) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((filters.rotationAngle * Math.PI) / 180);
    ctx.drawImage(imageSource, -width / 2, -height / 2);
    ctx.restore();
  } else {
    ctx.drawImage(imageSource, 0, 0, width, height);
  }

  // Extract pixel data for direct manipulation
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const contrastFactor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
  const brightnessOffset = (filters.brightness / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Grayscale luminance calculation
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // 2. Brightness adjustment
    gray += brightnessOffset;

    // 3. Contrast enhancement
    gray = contrastFactor * (gray - 128) + 128;

    // Clamp
    gray = Math.max(0, Math.min(255, gray));

    // 4. Binarization / Adaptive Thresholding
    if (filters.binarizeThreshold > 0) {
      gray = gray >= filters.binarizeThreshold ? 255 : 0;
    }

    // 5. Color Inversion
    if (filters.invert) {
      gray = 255 - gray;
    }

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
