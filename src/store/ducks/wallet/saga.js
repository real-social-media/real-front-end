import API from '@aws-amplify/api'
import path from 'ramda/src/path'
import { put, takeLatest, call } from 'redux-saga/effects'
import * as actions from 'store/ducks/wallet/actions'
import * as constants from 'store/ducks/wallet/constants'

function* walletGetRequest() {
  try {
    const response = yield call([API, 'post'], 'REAL_TRANSACTIONS_API', '/wallet')
    const wallet = path(['body', 'wallet', 'REAL'], response)

    yield put(actions.walletGetSuccess(wallet))
  } catch (error) {
    yield put(actions.walletGetFailure(error))
  }
}

export default () => [takeLatest(constants.WALLET_GET_REQUEST, walletGetRequest)]
