import CropPicker from 'react-native-image-crop-picker'
import mapSeries from 'async/mapSeries'
import { autoKeyboardClose, cropperOptions, requestPayload, handleError } from 'services/providers/Camera/helpers'
import { mediaType } from 'services/providers/Camera/helpers'

/**
 * Asset format definition is required for createPost graphql query
 */
const generateAssetFormat = (extension) => {
  const format = extension.toUpperCase()

  return ['HEIC', 'MP4'].includes(format) ? format : 'JPEG'
}

/**
 * react-native-image-crop-picker request object
 */
const pickerOptions = (multiple, customPickerOptions) => ({
  multiple: true,
  avoidEmptySpaceAroundImage: false,
  includeExif: true,
  mediaType: 'any',
  compressVideoPreset: 'HighestQuality',
  compressImageQuality: 1,
  maxFiles: multiple ? 5 : 1,
  ...customPickerOptions,
})

const videoCroppedOptions = (size) => ({
  path: '',
  cropRect: {
    x: 0,
    y: 0,
    height: size,
    width: size,
  },
})

const mapCropperResponse = async (selected, processor) => {
  const responses = Array.isArray(selected) ? selected : [selected]
  const mapped = await mapSeries(responses, processor)
  return mapped.filter((item) => item)
}

/**
 * Formatting react-native-image-crop-picker libs response
 * to match react-native-camera libs response
 *
 * note that selectedMedia.fileSource is coming from manual code
 * which only works by applying a patch from patches/react-native-image-crop-picker
 */
const formatPickerResponse = (selectedMedia) => {
  const extension = selectedMedia.path.split('?')[0].split('#')[0].split('.').pop()
  const format = generateAssetFormat(extension)

  return {
    format,
    extension,
    path: selectedMedia.path,
    filename: selectedMedia.filename,
  }
}

const useLibrary = ({
  handleProcessedMedia = () => {},
  multiple = true,
  customPickerOptions = {},
}) => {
  /**
   * Handle gallery media selection
   */
  const handleLibrarySnap = async () => {
    const cameraState = { mediaSize: '4:3' }

    /**
     * Image crop picker might eventually throw an error when user cancelled image selection
     */
    try {
      const selectedMedia = await CropPicker.openPicker(pickerOptions(multiple, customPickerOptions))
      const payloadSeries = await mapCropperResponse(selectedMedia, async (media, callback) => {
        const tempMedia = formatPickerResponse(media)
        const snappedMedia = { ...media, ...tempMedia }
        const croppedMedia = mediaType(tempMedia.extension) === 'VIDEO'
          ? videoCroppedOptions(selectedMedia.width)
          : await CropPicker.openCropper(cropperOptions(cameraState, media))
        const payload = requestPayload('gallery')(cameraState, snappedMedia, croppedMedia)
        autoKeyboardClose()
        callback(null, payload)
      })

      return handleProcessedMedia(payloadSeries)
    } catch (error) {
      handleError(error)
    }
  }

  return {
    handleLibrarySnap,
  }
}

export default useLibrary
