import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/auth/queries'
import authSigninApple from 'store/ducks/auth/saga/authSigninApple'
import { federatedAppleSignin, validateUserExistance } from 'services/AWS'
import { handleAnonymousSignin } from 'store/ducks/auth/saga/authSigninAnonymous'

/**
 * Mock Data
 */
const applePayload = {
  user: {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
  },
  token: 'token',
  expires_at: 'expires_at',
}

const userPayload = {
  id: applePayload.user.id,
  fullName: applePayload.user.fullName,
  email: applePayload.user.email,
  authProvider: 'APPLE',
  token: applePayload.token,
  expires_at: applePayload.expires_at,
}

const credentials = {
  token: userPayload.token,
  expires_at: userPayload.expires_at,
}

const error = new Error('Error')

/**
 * Mock Functions
 */
const AwsAuth = { federatedSignIn: jest.fn(), currentUserCredentials: jest.fn() }
const navigation = { navigate: jest.fn(), reset: jest.fn() }

jest.mock('services/AWS', () => ({
  federatedAppleSignin: jest.fn(),
  validateUserExistance: jest.fn(),
}))

jest.mock('store/ducks/auth/saga/authSigninAnonymous', () => ({
  handleAnonymousSignin: jest.fn(),
}))

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

/**
 * Mock Context
 */
const context = [
  [getContext('AwsAuth'), AwsAuth],
  [getContext('ReactNavigationRef'), { current: navigation }],
]

describe('authSigninApple', () => {
  beforeAll(() => {
    federatedAppleSignin.mockResolvedValue(applePayload)
    validateUserExistance.mockResolvedValue(false)
  })

  afterEach(() => {
    federatedAppleSignin.mockClear()
    validateUserExistance.mockClear()
    handleAnonymousSignin.mockClear()
    AwsAuth.federatedSignIn.mockClear()
    navigation.navigate.mockClear()
    navigation.reset.mockClear()
  })

  describe('sign in flow', () => {
    it('success', async () => {
      validateUserExistance.mockResolvedValueOnce(true)

      await expectSaga(testAsRootSaga(authSigninApple))
        .provide(context)

        .call(validateUserExistance, userPayload)
        .not.call(handleAnonymousSignin)
        .not.call([queryService, 'apiRequest'], queries.setFullname, { fullName: userPayload.fullName })
        .call([AwsAuth, 'federatedSignIn'], 'appleid.apple.com', credentials, userPayload)
        .call([queryService, 'apiRequest'], queries.linkAppleLogin, { appleIdToken: userPayload.token })
        .put(actions.authGetUserRequest())
        .put(actions.authPrefetchRequest())
        .put(actions.authSigninAppleSuccess())

        .dispatch(actions.authSigninAppleRequest())
        .dispatch(actions.authGetUserSuccess())
        .silentRun()

      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
    })

    it('failure', async () => {
      validateUserExistance.mockResolvedValueOnce(true)
      AwsAuth.federatedSignIn.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninApple))
        .provide(context)

        .put(actions.authSigninAppleFailure(error))

        .dispatch(actions.authSigninAppleRequest())
        .silentRun()
    })
  })

  describe('sign up flow', () => {
    it('success', async () => {
      await expectSaga(testAsRootSaga(authSigninApple))
        .provide(context)

        .call(validateUserExistance, userPayload)
        .call(handleAnonymousSignin)
        .call([queryService, 'apiRequest'], queries.linkAppleLogin, { appleIdToken: userPayload.token })
        .call([queryService, 'apiRequest'], queries.setFullname, { fullName: userPayload.fullName })
        .not.put(actions.authGetUserRequest())
        .not.put(actions.authPrefetchRequest())
        .put(actions.authSigninAppleSuccess())

        .dispatch(actions.authSigninAppleRequest())
        .silentRun()

      testNavigate(navigation, 'Auth.AuthUsername', { nextRoute: 'app' })
    })

    it('failure', async () => {
      handleAnonymousSignin.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninApple))
        .provide(context)

        .put(actions.authSigninAppleFailure(error))

        .dispatch(actions.authSigninAppleRequest())
        .silentRun()
    })
  })
})
