import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { renderHook } from '@testing-library/react-hooks'
import CropPicker from 'react-native-image-crop-picker'
import useCamera from 'services/providers/Camera/useCamera'
import useCameraState from 'services/providers/Camera/useCameraState'
import * as authSelector from 'store/ducks/auth/selectors'
import { MAX_VIDEO_RECORD_DURATION } from 'store/ducks/player/constants'

const cameraStateValue = ({
  postsCreate: 'postsCreate',
  flashMode: 'flashMode',
  handleFlashToggle: 'handleFlashToggle',
  flipMode: 'flipMode',
  handleFlipToggle: 'handleFlipToggle',
  mediaSize: 'mediaSize',
  setMediaSize: 'setMediaSize',
  recordedDuration: 0,
  setRecordedDuration: jest.fn(number => number),
})

const cropOptionsValue = ({
  state: {
    mediaSize: 'mediaSize',
  },

  snappedMedia: {
    uri: 'uri',
    path: 'path',
    extension: 'extension',
    format: 'format',
  },

  croppedMedia: {
    path: 'path',
    cropRect: {
      x: 'x',
      y: 'y',
      width: 'width',
      height: 'height',
    },
  },
})

const takePictureOptions = {
  quality: 1,
  base64: false,
  writeExif: true,
  exif: true,
  mirrorImage: false,
}

const recordVideoOptions = {
  maxDuration: MAX_VIDEO_RECORD_DURATION,
}

jest.spyOn(authSelector, 'authUser').mockReturnValue({ userStatus: 'ACTIVE' })
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (cb) => cb() }))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
jest.mock('services/providers/Camera/useCameraState')
jest.mock('react-native-image-crop-picker', () => ({ openCropper: jest.fn() }))

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const navigation = { popToTop: jest.fn(), navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const openCropper = jest.fn(() => cropOptionsValue)
CropPicker.openCropper.mockReturnValue(openCropper)

useCameraState.mockReturnValue(cameraStateValue)

describe('PostType screen', () => {
  beforeEach(() => {
    dispatch.mockClear()
    navigation.navigate.mockClear()
    navigation.popToTop.mockClear()
    openCropper.mockClear()
    cameraStateValue.setRecordedDuration.mockClear()
  })

  it('should provide handleProcessedMedia for useCamera hook', async () => {
    const cameraRef = {
      current: {
        pausePreview: jest.fn(),
        takePictureAsync: jest.fn(() => Promise.resolve(1)),
      },
    }
    const { result } = renderHook(() => useCamera({ cameraRef }))

    await result.current.handleCameraSnap()
    expect(cameraRef.current.pausePreview).toHaveBeenCalled()
    expect(cameraRef.current.takePictureAsync).toHaveBeenCalledWith(takePictureOptions)
    expect(CropPicker.openCropper).toHaveBeenCalled()
  })

  it('should record a video and stop recording', async () => {
    const cameraRef = {
      current: {
        recordAsync: jest.fn().mockResolvedValue(1),
        onRecordingStart: jest.fn(),
        stopRecording: jest.fn(),
      },
    }

    const { result } = renderHook(() => useCamera({ cameraRef }))

    await result.current.handleVideoRecord()
    expect(cameraRef.current.recordAsync).toHaveBeenCalledWith(recordVideoOptions)
    result.current.onRecordingEnd()
    expect(cameraRef.current.stopRecording).toHaveBeenCalled()
  })

  it('should increase recorded duration on video recording start', () => {
    const { result } = renderHook(() => useCamera({ cameraRef: {} }))

    jest.useFakeTimers()
    result.current.onRecordingStart()
    jest.runOnlyPendingTimers()
    expect(cameraStateValue.setRecordedDuration.mock.calls).toHaveLength(1)
  })

})
