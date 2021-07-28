import { createAction } from 'redux-actions'

import * as constants from 'store/ducks/player/constants'

/**
 *
 */
export const toggleSound = createAction(constants.TOGGLE_SOUND)
