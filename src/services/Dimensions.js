import Layout from 'constants/Layout'

const BASE_SHIFT = 40

export const getScreenAspectRatio = (aspect, baseWidth) => {
  if (aspect === '4:3') {
    return ({
      x: baseWidth,
      y: Math.floor(baseWidth / 3) * 4,
    })
  }

  return {
    x: baseWidth,
    y: baseWidth,
  }
}

export const getPhotoProportions = (baseWidth, baseHeight) => {
  const scaleFactor = baseWidth / Layout.window.width

  return {
    x: Layout.window.width,
    y: baseHeight / scaleFactor,
  }
}

export const getDimensionsFromPostSize = ({ width: inputWidth, height: inputHeight }) => {
  const { x, y } = getPhotoProportions(inputWidth, inputHeight)
  const nextHeight = Math.min(y, Layout.window.height * .65)
  return { width: x, height: nextHeight }
}

export const getCameraBonds = (aspect) => {
  if (aspect === '4:3') {
    const shift = (Layout.window.height - Layout.window.width / 3 * 4) / 2
    const top = shift - BASE_SHIFT
    const bottom = shift + BASE_SHIFT
    return { top, bottom }
  }

  if (aspect === '1:1') {
    const shift = (Layout.window.height - Layout.window.width) / 2
    const top = shift - BASE_SHIFT
    const bottom = shift + BASE_SHIFT
    return { top, bottom }
  }

  return { top: 0, bottom: 0 }
}

export const getPhotoDimensions = ({ snappedPhoto, mediaSize }) => {
  const scaleFactor = snappedPhoto.width / Layout.window.width

  if (mediaSize === '4:3') {
    return {
      offset: {
        x: 0,
        y: getCameraBonds('4:3').top * scaleFactor,
      },
      size: {
        width: snappedPhoto.width,
        height: (snappedPhoto.width / 3) * 4,
      },
    }
  }

  if (mediaSize === '1:1') {
    return {
      offset: {
        x: 0,
        y: getCameraBonds('1:1').top * scaleFactor,
      },
      size: {
        width: snappedPhoto.width,
        height: snappedPhoto.width,
      },
    }
  }
}
