import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/camera/constants'

export const initialState = {
  cameraCapture: {
    data: [],
    payload: [],
    status: 'idle',
  },
  isRecording: false,
}

/**
 *
 */
const cameraCaptureRequest = (state, action) => update(state, {
  cameraCapture: {
    payload: { $set: action.payload },
    status: { $set: 'loading' },
  },
})

const cameraCaptureSuccess = (state, action) => update(state, {
  cameraCapture: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const cameraCaptureFailure = (state) => update(state, {
  cameraCapture: {
    status: { $set: 'failure' },
  },
})

const cameraCaptureIdle = (state, action) => update(state, {
  cameraCapture: {
    data: { $set: state.cameraCapture.data.filter(item => item.uri !== action.payload.payload.uri) },
    status: { $set: 'idle' },
  },
})

/**
 * Toggle the video recording state
 */
const toggleRecordingState = (state) => update(state, {
  isRecording: {
    $set: !state.isRecording,
  },
})

export default handleActions({
  [constants.CAMERA_CAPTURE_REQUEST]: cameraCaptureRequest,
  [constants.CAMERA_CAPTURE_SUCCESS]: cameraCaptureSuccess,
  [constants.CAMERA_CAPTURE_FAILURE]: cameraCaptureFailure,
  [constants.CAMERA_CAPTURE_IDLE]: cameraCaptureIdle,
  [constants.TOGGLE_RECORDING_STATE]: toggleRecordingState,
}, initialState)
