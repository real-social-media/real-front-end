import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'
import * as constants from 'store/ducks/wallet/constants'

/**
 *
 */
export const walletGetRequest = createAction(constants.WALLET_GET_REQUEST)
export const walletGetSuccess = createAction(constants.WALLET_GET_SUCCESS)
export const walletGetFailure = createFailureAction(constants.WALLET_GET_FAILURE)
