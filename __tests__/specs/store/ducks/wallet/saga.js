import API from '@aws-amplify/api'
import * as matchers from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import * as actions from 'store/ducks/wallet/actions'
import wallet from 'store/ducks/wallet/saga'

/**
 * Mock Data
 */
const response = { body: { wallet: { REAL: { total: '0' } } } }

/**
 * Mock Functions
 */
jest.mock('@aws-amplify/api', () => ({ post: jest.fn() }))
API.post.mockResolvedValue(response)

describe('Wallet saga', () => {
  it('success', async () => {
    await expectSaga(testAsRootSaga(wallet))
      .provide([[matchers.call.fn(API.post), Promise.resolve(response)]])
      .call([API, 'post'], 'REAL_TRANSACTIONS_API', '/wallet')
      .put(actions.walletGetSuccess(response.body.wallet.REAL))

      .dispatch(actions.walletGetRequest())
      .silentRun()
  })

  it('failure', async () => {
    const error = new Error('Error')

    await expectSaga(testAsRootSaga(wallet))
      .provide([[matchers.call.fn(API.post), Promise.reject(error)]])
      .call([API, 'post'], 'REAL_TRANSACTIONS_API', '/wallet')
      .put(actions.walletGetFailure(error))
      .not.put(actions.walletGetSuccess())

      .dispatch(actions.walletGetRequest())
      .silentRun()
  })
})
