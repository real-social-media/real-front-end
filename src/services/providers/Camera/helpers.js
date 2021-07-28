import { Keyboard } from 'react-native'
import * as Logger from 'services/Logger'
import { getScreenAspectRatio } from 'services/Dimensions'

export const handleError = error => {
  if (error.code !== 'E_PICKER_CANCELLED') {
    Logger.captureException(error)
  }
}

/**
 * Formatting crop coordinates to match graphql supported format
 */
const formatCropCoordinates = (cropRect) => ({
  lowerRight: { x: cropRect.x + cropRect.width, y: cropRect.y + cropRect.height },
  upperLeft: { x: cropRect.x, y: cropRect.y },
})

/**
 * We use it for prevent open keyboard after crop
 * https://github.com/ivpusic/react-native-image-crop-picker/issues/1273
 */
export const autoKeyboardClose = () => {
  Keyboard.dismiss()
}

/**
 * react-native-image-crop-picker request object
 */
export const cropperOptions = (state, snappedMedia) => ({
  avoidEmptySpaceAroundImage: false,
  path: snappedMedia.path || snappedMedia.uri,
  width: getScreenAspectRatio(state.mediaSize, snappedMedia.width).x,
  height: getScreenAspectRatio(state.mediaSize, snappedMedia.width).y,
  includeExif: true,
  compressImageQuality: 1,
})

/**
 * graphql request object
 */
const originalMetadata = snappedMedia => ({
  ...snappedMedia.exif,
  creationDate: snappedMedia.creationDate,
  modificationDate: snappedMedia.modificationDate,
  adjustmentData: snappedMedia.adjustmentData,
})

export const requestPayload = (type = 'gallery') => (state, snappedMedia, croppedMedia) => ({
  uri: (snappedMedia.uri || snappedMedia.path).replace('file://', ''),
  preview: (croppedMedia.path || croppedMedia.path).replace('file://', ''),
  originalFormat: snappedMedia.extension || 'jpg',
  imageFormat: snappedMedia.format || 'JPEG',
  crop: formatCropCoordinates(croppedMedia.cropRect),
  originalMetadata: JSON.stringify(originalMetadata(snappedMedia)),
  takenInReal: type === 'camera',
  mediaSize: state.mediaSize,
})

export const mediaType = (originalFormat) => {
  const images = ['jpg', 'jpeg', 'heic', 'png']
  if (images.includes(originalFormat))
    return 'IMAGE'

  const videos = ['mp4', 'mov']
  if (videos.includes(originalFormat))
    return 'VIDEO'

  throw new Error('Unsupported format')
}

export const isMedia = (type) => {
  return ['IMAGE', 'VIDEO'].includes(type)
}
