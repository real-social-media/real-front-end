import { put, race, take, call } from 'redux-saga/effects'
import * as actions from 'store/ducks/auth/actions'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import * as constants from 'store/ducks/auth/constants'
import * as pushActions from 'store/ducks/push/actions'

export function* refreshUser() {
  yield put(actions.authGetUserRequest())

  const { getUserFailure } = yield race({
    getUserSuccess: take(constants.AUTH_GET_USER_SUCCESS),
    getUserFailure: take(constants.AUTH_GET_USER_FAILURE),
  })

  if (getUserFailure) {
    throw getUserFailure.payload
  }

  yield put(actions.authPrefetchRequest())
  yield put(pushActions.pushStartRequest())
}

function* authorize() {
  yield call(refreshUser)

  const navigation = yield NavigationService.getNavigation()
  navigationActions.navigateResetToApp(navigation)
}

export default authorize
