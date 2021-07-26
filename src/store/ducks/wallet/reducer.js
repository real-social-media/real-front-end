import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/wallet/constants'

export const initialState = {
  /**
   *
   */
  walletGet: {
    data: {
      total: '0',
    },
    status: 'idle',
  },
}

/**
 *
 */
const walletGetRequest = (state) =>
  update(state, {
    walletGet: {
      status: { $set: 'loading' },
    },
  })

const walletGetSuccess = (state, action) =>
  update(state, {
    walletGet: {
      data: { $set: action.payload },
      status: { $set: 'success' },
    },
  })

const walletGetFailure = (state) =>
  update(state, {
    walletGet: {
      status: { $set: 'failure' },
    },
  })

export default handleActions(
  {
    [constants.WALLET_GET_REQUEST]: walletGetRequest,
    [constants.WALLET_GET_SUCCESS]: walletGetSuccess,
    [constants.WALLET_GET_FAILURE]: walletGetFailure,
  },
  initialState,
)
