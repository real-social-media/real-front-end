/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testBlackListAction", "expectSaga", "testShowMessage"] }] */
import { Alert } from 'react-native'
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import { showMessage } from 'react-native-flash-message'
import { createFailureAction } from 'store/errors'
import snackbars from 'store/ducks/snackbars/saga'
import * as authActions from 'store/ducks/auth/actions'
import * as Logger from 'services/Logger'
import { CancelRequestOnSignoutError, UserInNotActiveError } from 'store/errors'

jest.spyOn(Alert, 'alert')
jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }))

const error = new Error('Error')
const failureAction = createFailureAction('ACTION_FAILURE')

describe('Capture Errors', () => {
  afterEach(() => {
    Alert.alert.mockClear()
    showMessage.mockClear()
    Logger.captureException.mockClear()
  })

  function testShowMessage({ message, type, icon }) {
    expect(showMessage).toHaveBeenCalled()
    const options = showMessage.mock.calls[0][0]

    expect(options.message).toBe(message)
    expect(options.type).toBe(type)
    expect(options.icon).toBe(icon)
  }

  describe('success', () => {
    it('default error message', async () => {
      await expectSaga(testAsRootSaga(snackbars)).dispatch(failureAction(error)).silentRun()

      testShowMessage({ message: 'Oops! Something went wrong', type: 'danger', icon: 'warning' })
    })

    it('capture exception', async () => {
      showMessage.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(snackbars)).dispatch(failureAction(error)).silentRun()

      expect(Logger.captureException).toHaveBeenCalledWith(error)
    })

    it('show specific user friendly error message', async () => {
      await expectSaga(testAsRootSaga(snackbars))
        .dispatch(authActions.authSigninCognitoFailure(error, { messageCode: 'USER_NOT_FOUND' }))
        .silentRun()

      testShowMessage({ message: 'User does not exist', type: 'danger', icon: 'warning' })
    })

    it('show generic user friendly error message', async () => {
      await expectSaga(testAsRootSaga(snackbars))
        .dispatch(authActions.authSigninCognitoFailure(error, { messageCode: 'GENERIC' }))
        .silentRun()

      testShowMessage({ message: 'Failed to signin', type: 'danger', icon: 'warning' })
    })
  })

  describe('prevent show a message', () => {
    it('anonymous user', async () => {
      const message = 'User is not ACTIVE'

      await expectSaga(testAsRootSaga(snackbars))
        .not.call(showMessage, { message, type: 'danger', icon: 'warning' })
        .dispatch({ type: 'ACTION_FAILURE', payload: { message: { text: message } } })
        .silentRun()
    })

    it('should not display CancelRequestOnSignoutError', async () => {
      const error = new CancelRequestOnSignoutError()

      await expectSaga(testAsRootSaga(snackbars)).dispatch(failureAction(error)).silentRun()

      expect(showMessage).not.toHaveBeenCalled()
    })

    it('should not display UserInNotActiveError', async () => {
      const error = new UserInNotActiveError()

      await expectSaga(testAsRootSaga(snackbars)).dispatch(failureAction(error)).silentRun()

      expect(showMessage).not.toHaveBeenCalled()
    })

    it('blacklist', () => {
      const testBlackListAction = (type) => async () => {
        await expectSaga(testAsRootSaga(snackbars)).dispatch({ type }).silentRun()
        expect(showMessage).not.toHaveBeenCalled()
      }

      testBlackListAction('AUTH_DATA_FAILURE')
      testBlackListAction('AUTH_FLOW_FAILURE')
      testBlackListAction('AUTH_PREFETCH_FAILURE')
      testBlackListAction('CACHE_FETCH_FAILURE')
      testBlackListAction('POSTS_REPORT_POST_VIEWS_FAILURE')
      testBlackListAction('USERS_REPORT_SCREEN_VIEWS_FAILURE')
      testBlackListAction('THEMES_CHECK_DEFAULT_FAILURE')
      testBlackListAction('WALLET_GET_FAILURE')
    })
  })
})
