import { useRef } from 'react'
import { Animated } from 'react-native'
import CropPicker from 'react-native-image-crop-picker'
import { useDispatch } from 'react-redux'
import { autoKeyboardClose, cropperOptions, requestPayload, handleError } from 'services/providers/Camera/helpers'
import { MAX_VIDEO_RECORD_DURATION } from 'store/ducks/player/constants'
import * as cameraActions from 'store/ducks/camera/actions'
import useCameraState from 'services/providers/Camera/useCameraState'

/**
 * react-native-camera request object
 */
const cameraPhotoOptions = {
  quality: 1,
  base64: false,
  writeExif: true,
  exif: true,
  mirrorImage: false,
}

const cameraVideoOptions = {
  maxDuration: MAX_VIDEO_RECORD_DURATION,
}

const videoCropOptions = {
  path: '',
  cropRect: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  },
}

const videoExtensionOptions = {
  extension: 'mov',
  format: 'mov',
}

const useCamera = ({ cameraRef, handleProcessedMedia = () => {} }) => {
  const dispatch = useDispatch()
  const cameraState = useCameraState()
  const recordIntervalRef = useRef()
  const shutterButtonScaleRef = useRef(new Animated.Value(1))

  /**
   * Handle camera photo capture
   */
  const handleCameraSnap = async () => {
    if (!cameraRef.current) return

    /**
     * Camera module might eventually throw an error when camera is not initialized on native side
     */
    try {
      cameraRef.current.pausePreview()
      const snappedPhoto = await cameraRef.current.takePictureAsync(cameraPhotoOptions)
      const croppedPhoto = await CropPicker.openCropper(cropperOptions(cameraState, snappedPhoto))
      const payload = requestPayload('camera')(cameraState, snappedPhoto, croppedPhoto)
      handleProcessedMedia([payload])
      cameraRef.current.resumePreview()
      autoKeyboardClose()
    } catch (error) {
      handleError(error)
    }
  }


  /**
   * Handle camera video recording end
   */
  const onRecordingEnd = (shouldResetDuration = true) => {
    if (!cameraRef.current) return
    cameraRef.current.stopRecording()
    clearInterval(recordIntervalRef.current)
    handleShutterButtonAnimation(1)
    dispatch(cameraActions.toggleRecordingState())
    if (shouldResetDuration) {
      cameraState.setRecordedDuration(0)
    }
  }

  /**
   * Animated the shutter button on video record start or end
   */
  const handleShutterButtonAnimation = (toValue) => Animated.spring(shutterButtonScaleRef.current, {
    toValue,
    duration: 80,
    useNativeDriver: true,
  }).start()

  const handleVideoProgress = () => {
    cameraState.setRecordedDuration(duration => {
      if (duration === MAX_VIDEO_RECORD_DURATION - 1) {
        onRecordingEnd(false)
        return 0
      }

      return duration + 1
    })
  }

  const onRecordingStart = () => {
    handleShutterButtonAnimation(1.4)
    dispatch(cameraActions.toggleRecordingState())
    recordIntervalRef.current = setInterval(handleVideoProgress, 1000)
  }

  /**
   * Handle camera video recording
   */
  const handleVideoRecord = async () => {
    if (!cameraRef.current) return

    /**
     * Camera module might eventually throw an error when camera is not initialized on native side
     */
    try {
      const promise = await cameraRef.current.recordAsync(cameraVideoOptions)
      const recordedVideo = { ...await promise, ...videoExtensionOptions }
      const payload = requestPayload('gallery')(cameraState, recordedVideo, videoCropOptions)
      handleProcessedMedia([payload])
      autoKeyboardClose()
    } catch (error) {
      handleError(error)
    }
  }

  return {
    handleCameraSnap,
    handleVideoRecord,
    onRecordingStart,
    onRecordingEnd,
    shutterButtonScaleRef,
    cameraRef,
    ...cameraState,
  }
}

export default useCamera
