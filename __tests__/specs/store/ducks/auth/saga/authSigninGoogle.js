import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as actions from 'store/ducks/auth/actions'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/auth/queries'
import authSigninGoogle from 'store/ducks/auth/saga/authSigninGoogle'
import { federatedGoogleSignin, validateUserExistance } from 'services/AWS'
import { handleAnonymousSignin } from 'store/ducks/auth/saga/authSigninAnonymous'

/**
 * Mock Data
 */
const googlePayload = {
  user: {
    id: 'id',
    name: 'name',
    email: 'valid@email.com',
  },
  token: 'token',
  expires_at: 'expires_at',
}

const userPayload = {
  id: googlePayload.user.id,
  name: googlePayload.user.name,
  email: googlePayload.user.email,
  authProvider: 'GOOGLE',
  token: googlePayload.token,
  expires_at: googlePayload.expires_at,
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
  federatedGoogleSignin: jest.fn(),
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

describe('authSigninGoogle', () => {
  beforeAll(() => {
    federatedGoogleSignin.mockResolvedValue(googlePayload)
    validateUserExistance.mockResolvedValue(false)
  })

  afterEach(() => {
    federatedGoogleSignin.mockClear()
    validateUserExistance.mockClear()
    handleAnonymousSignin.mockClear()
    AwsAuth.federatedSignIn.mockClear()
    navigation.navigate.mockClear()
    navigation.reset.mockClear()
  })

  describe('sign in flow', () => {
    it('success', async () => {
      validateUserExistance.mockResolvedValueOnce(true)

      await expectSaga(testAsRootSaga(authSigninGoogle))
        .provide(context)

        .call(validateUserExistance, userPayload)
        .not.call(handleAnonymousSignin)
        .not.call([queryService, 'apiRequest'], queries.setFullname, { fullName: userPayload.name })
        .call([AwsAuth, 'federatedSignIn'], 'google', credentials, userPayload)
        .call([queryService, 'apiRequest'], queries.linkGoogleLogin, { googleIdToken: userPayload.token })

        .put(actions.authGetUserRequest())
        .put(actions.authPrefetchRequest())
        .put(actions.authSigninGoogleSuccess())

        .dispatch(actions.authSigninGoogleRequest())
        .dispatch(actions.authGetUserSuccess())
        .silentRun()

      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: 'App' }] })
    })

    it('failure', async () => {
      validateUserExistance.mockResolvedValueOnce(true)
      AwsAuth.federatedSignIn.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninGoogle))
        .provide(context)

        .put(actions.authSigninGoogleFailure(error))

        .dispatch(actions.authSigninGoogleRequest())
        .silentRun()
    })
  })

  describe('sign up flow', () => {
    it('success', async () => {
      await expectSaga(testAsRootSaga(authSigninGoogle))
        .provide(context)

        .call(validateUserExistance, userPayload)
        .call(handleAnonymousSignin)
        .call([queryService, 'apiRequest'], queries.linkGoogleLogin, { googleIdToken: userPayload.token })
        .call([queryService, 'apiRequest'], queries.setFullname, { fullName: userPayload.name })
        .not.put(actions.authGetUserRequest())
        .not.put(actions.authPrefetchRequest())
        .put(actions.authSigninGoogleSuccess())

        .dispatch(actions.authSigninGoogleRequest())
        .dispatch(actions.authGetUserSuccess())
        .silentRun()

      testNavigate(navigation, 'Auth.AuthUsername', { nextRoute: 'app' })
    })

    it('failure', async () => {
      handleAnonymousSignin.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(authSigninGoogle))
        .provide(context)

        .put(actions.authSigninGoogleFailure(error))

        .dispatch(actions.authSigninGoogleRequest())
        .silentRun()
    })
  })
})
