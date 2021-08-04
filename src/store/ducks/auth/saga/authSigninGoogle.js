import { put, call, getContext, takeEvery } from 'redux-saga/effects'
import { federatedGoogleSignin, validateUserExistance } from 'services/AWS'
import * as actions from 'store/ducks/auth/actions'
import * as constants from 'store/ducks/auth/constants'
import * as queries from 'store/ducks/auth/queries'
import * as queryService from 'services/Query'
import { handleAnonymousSignin } from 'store/ducks/auth/saga/authSigninAnonymous'
import * as navigationActions from 'navigation/actions'
import * as NavigationService from 'services/Navigation'
import authorize from 'store/ducks/auth/saga/authorize'

/**
 * Authenticate using google into identity pool
 */
function* getGooglePayload() {
  const google = yield federatedGoogleSignin()

  const userPayload = {
    id: google.user.id,
    name: google.user.name,
    email: google.user.email,
    authProvider: 'GOOGLE',
    token: google.token,
    expires_at: google.expires_at,
  }

  return userPayload
}

function* googleSignUpFlow(userPayload) {
  const navigation = yield NavigationService.getNavigation()

  yield call(handleAnonymousSignin)
  yield call([queryService, 'apiRequest'], queries.linkGoogleLogin, { googleIdToken: userPayload.token })
  yield call([queryService, 'apiRequest'], queries.setFullname, { fullName: userPayload.name })

  navigationActions.navigateAuthUsername(navigation, { nextRoute: 'app' })
}

function* googleSignInFlow(userPayload) {
  const AwsAuth = yield getContext('AwsAuth')
  const credentials = {
    token: userPayload.token,
    expires_at: userPayload.expires_at,
  }

  yield call([AwsAuth, 'federatedSignIn'], 'google', credentials, userPayload)
  yield call([queryService, 'apiRequest'], queries.linkGoogleLogin, { googleIdToken: userPayload.token })
  yield call(authorize)
}

/**
 *
 */
function* handleAuthSigninGoogleRequest() {
  const userPayload = yield call(getGooglePayload)
  const userExists = yield call(validateUserExistance, userPayload)

  if (!userExists) {
    yield call(googleSignUpFlow, userPayload)
  } else {
    yield call(googleSignInFlow, userPayload)
  }
}

/**
 *
 */
function* authSigninGoogleRequest(req) {
  try {
    yield handleAuthSigninGoogleRequest(req.payload)
    yield put(actions.authSigninGoogleSuccess())
  } catch (error) {
    if (error.message && error.message.includes('The user canceled the sign in request')) {
      yield put(actions.authSigninGoogleFailure(error, { messageCode: 'CANCELED' }))
    } else {
      yield put(actions.authSigninGoogleFailure(error))
    }
  }
}

export default () => [takeEvery(constants.AUTH_SIGNIN_GOOGLE_REQUEST, authSigninGoogleRequest)]
