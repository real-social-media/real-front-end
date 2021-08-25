import keys from 'ramda/src/keys'
import map from 'ramda/src/map'
import { createSelector } from 'reselect'

/**
 *
 */
export const walletGet = (state) => state?.wallet?.walletGet
export const walletCoins = (state) => walletGet(state)?.data || {}

const extractOptions = map((key) => ({ value: key, label: key }))
export const walletCoinsOptions = createSelector(walletCoins, (coins) => extractOptions(keys(coins)))
