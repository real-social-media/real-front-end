import { put, takeEvery, getContext, call } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import authorize from 'store/ducks/auth/saga/authorize'

/**
 * The currentUserCredentials method will automatically refresh the accessToken
 * and idToken if tokens are expired and a valid refreshToken presented.
 */
function* refreshTokens() {
  const AwsAuth = yield getContext('AwsAuth')
  yield AwsAuth.currentUserCredentials()
}

function* handleAuthFlowRequest() {
  yield call(refreshTokens)
  yield call(authorize)
}

function* authFlowRequest() {
  try {
    yield call(handleAuthFlowRequest)
    yield put(actions.authFlowSuccess())
  } catch (error) {
    yield put(actions.authFlowFailure(error))
  }
}

export default () => [takeEvery(constants.AUTH_FLOW_REQUEST, authFlowRequest)]
