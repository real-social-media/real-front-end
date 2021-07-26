import { combineReducers } from 'redux'
import wallet from 'store/ducks/wallet/reducer'
import * as actions from 'store/ducks/wallet/actions'
import * as selectors from 'store/ducks/wallet/selectors'
import { testReducer } from 'tests/utils/helpers'

const reducer = combineReducers({ wallet })

describe('wallet', () => {
  describe('walletGet', () => {
    it('initial state', () => {
      testReducer(reducer).expect(selectors.walletGet, { data: { total: '0' }, status: 'idle' })
    })

    it('loading', () => {
      testReducer(reducer)
        .put(actions.walletGetRequest())
        .expect(selectors.walletGet, { data: { total: '0' }, status: 'loading' })
    })

    it('success', () => {
      const wallet = { total: '0.99' }

      testReducer(reducer)
        .put(actions.walletGetSuccess(wallet))
        .expect(selectors.walletGet, { data: wallet, status: 'success' })
    })

    it('failure', () => {
      const error = new Error('Native Error')

      testReducer(reducer)
        .put(actions.walletGetFailure(error))
        .expect(selectors.walletGet, { data: { total: '0' }, status: 'failure' })
    })
  })
})
