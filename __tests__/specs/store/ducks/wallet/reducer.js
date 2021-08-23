import { combineReducers } from 'redux'
import wallet from 'store/ducks/wallet/reducer'
import * as actions from 'store/ducks/wallet/actions'
import * as selectors from 'store/ducks/wallet/selectors'
import { testReducer } from 'tests/utils/helpers'

const reducer = combineReducers({ wallet })

describe('wallet', () => {
  describe('walletGet', () => {
    it('initial state', () => {
      testReducer(reducer)
        .expect(selectors.walletGet, { data: {}, status: 'idle' })
        .expect(selectors.walletCoins, {})
        .expect(selectors.walletCoinsOptions, [])
    })

    it('loading', () => {
      testReducer(reducer).put(actions.walletGetRequest()).expect(selectors.walletGet, { data: {}, status: 'loading' })
    })

    it('success', () => {
      const wallet = { REAL: { a: 1, b: 2 }, ALEX: { a: 1, b: 2 } }

      testReducer(reducer)
        .put(actions.walletGetSuccess(wallet))
        .expect(selectors.walletGet, { data: wallet, status: 'success' })
        .expect(selectors.walletCoins, wallet)
        .expect(selectors.walletCoinsOptions, [
          {
            label: 'REAL',
            value: 'REAL',
          },
          {
            label: 'ALEX',
            value: 'ALEX',
          },
        ])
    })

    it('failure', () => {
      const error = new Error('Native Error')

      testReducer(reducer)
        .put(actions.walletGetFailure(error))
        .expect(selectors.walletGet, { data: {}, status: 'failure' })
    })
  })
})
