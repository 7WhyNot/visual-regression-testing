import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const resizeImage = (image, targetWidth, targetHeight) => {
  if (image.width === targetWidth && image.height === targetHeight) {
    return image;
  }
  const newImage = new PNG({ width: targetWidth, height: targetHeight });
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (targetWidth * y + x) << 2;
      if (x < image.width && y < image.height) {
        const oldIdx = (image.width * y + x) << 2;
        newImage.data[idx] = image.data[oldIdx];
        newImage.data[idx + 1] = image.data[oldIdx + 1];
        newImage.data[idx + 2] = image.data[oldIdx + 2];
        newImage.data[idx + 3] = image.data[oldIdx + 3];
      } else {
        newImage.data[idx] = 255;
        newImage.data[idx + 1] = 255;
        newImage.data[idx + 2] = 255;
        newImage.data[idx + 3] = 0;
      }
    }
  }
  return newImage;
};

export const compareImages = (baselineBuffer, currentBuffer, threshold = 0.1) => {
  const baseImg = PNG.sync.read(baselineBuffer);
  const currImg = PNG.sync.read(currentBuffer);

  const maxWidth = Math.max(baseImg.width, currImg.width);
  const maxHeight = Math.max(baseImg.height, currImg.height);

  const baselineImage = resizeImage(baseImg, maxWidth, maxHeight);
  const currentImage = resizeImage(currImg, maxWidth, maxHeight);

  const diffImage = new PNG({ width: maxWidth, height: maxHeight });

  const mismatchedPixels = pixelmatch(
    baselineImage.data,
    currentImage.data,
    diffImage.data,
    maxWidth,
    maxHeight,
    {
      threshold,
      includeAA: false,
      diffColor: [255, 0, 0],
      alpha: 0.2
    }
  );

  const totalPixels = maxWidth * maxHeight;
  const mismatchPercentage = totalPixels === 0 ? 0 : (mismatchedPixels / totalPixels) * 100;
  const diffBuffer = PNG.sync.write(diffImage);

  return { mismatchPercentage, diffBuffer };
};

export default {
  compareImages
};
