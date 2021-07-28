import { prop } from 'ramda'
import { createSelector } from 'reselect'

const camera = prop('camera')
export const cameraRecordingSelector = createSelector(camera, prop('isRecording'))
