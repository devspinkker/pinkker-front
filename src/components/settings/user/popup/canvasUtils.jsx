export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, flip = { horizontal: false, vertical: false }) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error("Canvas context not found");
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // Calcular tamaño del canvas para manejar rotación
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Configurar transformación en el canvas
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Dibujar imagen rotada
  ctx.drawImage(image, 0, 0);

  // Extraer la región recortada
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // Ajustar canvas al tamaño del recorte
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Dibujar los datos recortados en el nuevo canvas
  ctx.putImageData(data, 0, 0);

  // Retornar como Base64
  return canvas.toDataURL('image/jpeg');
}


export async function getRotatedImage(imageSrc, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const orientationChanged =
    rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
}
