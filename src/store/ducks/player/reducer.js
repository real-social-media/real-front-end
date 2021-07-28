import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/player/constants'

export const initialState = {
  muted: true,
}

/**
 * toggles the video sound between muted and sound
 */
const toggleSound = (state) => update(state, {
  muted: {
    $set: !state.muted,
  },
})

export default handleActions({
  [constants.TOGGLE_SOUND]: toggleSound,
}, initialState)
