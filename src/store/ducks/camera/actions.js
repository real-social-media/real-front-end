import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'

import * as constants from 'store/ducks/camera/constants'

/**
 *
 */
export const cameraCaptureIdle = createAction(constants.CAMERA_CAPTURE_IDLE)
export const cameraCaptureRequest = createAction(constants.CAMERA_CAPTURE_REQUEST)
export const cameraCaptureSuccess = createAction(constants.CAMERA_CAPTURE_SUCCESS)
export const cameraCaptureFailure = createFailureAction(constants.CAMERA_CAPTURE_FAILURE)

export const toggleRecordingState = createAction(constants.TOGGLE_RECORDING_STATE)
