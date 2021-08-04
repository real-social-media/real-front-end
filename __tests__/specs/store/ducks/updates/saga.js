import { Alert, Linking, NativeModules } from 'react-native'
import { expectSaga } from 'redux-saga-test-plan'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'
import * as Logger from 'services/Logger'
import * as queryService from 'services/Query'
import { testAsRootSaga } from 'tests/utils/helpers'
import updates, { isNewerThan } from 'store/ducks/updates/saga'
import * as updatesActions from 'store/ducks/updates/actions'

jest.mock('services/Query', () => ({ httpRequest: jest.fn() }))
jest.mock('react-native-device-info', () => ({ getBundleId: jest.fn(), getVersion: jest.fn() }))
jest.mock('react-native-config', () => ({ ENVIRONMENT: 'production', APPSTORE_ID: 'APPSTORE_ID', APPSTORE_NAME: 'APPSTORE_NAME' }))
jest.spyOn(Alert, 'alert')
jest.spyOn(Linking, 'openURL')

DeviceInfo.getBundleId.mockReturnValue('app.real.mobile')
DeviceInfo.getVersion.mockReturnValue('1.0.0')
NativeModules.RNLocalize = { initialConstants: { country: 'en' } }

queryService.httpRequest.mockResolvedValue({
  json: () => ({ resultCount: 1, results: [{ version: '1.0.1' }] }),
})

const setupSaga = () => expectSaga(testAsRootSaga(updates)).dispatch(updatesActions.updatesCheckRequest()).silentRun()

describe('Updates saga', () => {
  afterEach(() => {
    Alert.alert.mockClear()
    Linking.openURL.mockClear()
  })

  it('isNewerThan', () => {
    expect(isNewerThan('1', '2')).toBeFalsy()
    expect(isNewerThan('2', '1')).toBeTruthy()
    expect(isNewerThan('10', '11')).toBeFalsy()
    expect(isNewerThan('11', '10')).toBeTruthy()
    expect(isNewerThan('10', '10')).toBeFalsy()

    expect(isNewerThan('1.0', '1.1')).toBeFalsy()
    expect(isNewerThan('1.9', '1.10')).toBeFalsy()
    expect(isNewerThan('1.1', '1.0')).toBeTruthy()
    expect(isNewerThan('1.10', '1.9')).toBeTruthy()

    expect(isNewerThan('2.0', '1.0')).toBeTruthy()
    expect(isNewerThan('1.0', '2.0')).toBeFalsy()
    expect(isNewerThan('2.0', '2.0')).toBeFalsy()

    expect(isNewerThan('1.9.0', '1.10.0')).toBeFalsy()
    expect(isNewerThan('1.10.0', '1.9.0')).toBeTruthy()
    expect(isNewerThan('1.1.0', '1.2.0')).toBeFalsy()
    expect(isNewerThan('1.2.0', '1.1.0')).toBeTruthy()
    expect(isNewerThan('1.2.0', '1.2.0')).toBeFalsy()

    expect(isNewerThan('1.0.9', '1.0.10')).toBeFalsy()
    expect(isNewerThan('1.0.10', '1.0.9')).toBeTruthy()
    expect(isNewerThan('1.0.1', '1.0.2')).toBeFalsy()
    expect(isNewerThan('1.0.2', '1.0.1')).toBeTruthy()
    expect(isNewerThan('1.0.2', '1.0.2')).toBeFalsy()

    expect(isNewerThan('1.0.0', '1.0.0.1')).toBeFalsy()
    expect(isNewerThan('1.0.0.1', '1.0.0')).toBeTruthy()

    expect(isNewerThan('', '')).toBeFalsy()
    expect(isNewerThan('1', '')).toBeTruthy()
    expect(isNewerThan('', '1')).toBeFalsy()
  })

  it('show update alert', async () => {
    await setupSaga()

    expect(Alert.alert).toHaveBeenCalled()
    const [title, desc, actions] = Alert.alert.mock.calls[0]

    expect(title).toBe('App Update Available')
    expect(desc).toBe('Please update REAL to continue')

    const updateBtn = actions[0]
    expect(updateBtn.text).toBe('Update Now')
    expect(updateBtn.style).toBe('cancel')

    updateBtn.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith('itms-apps://itunes.apple.com/app/idAPPSTORE_ID')
  })

  describe('should not show alert when', () => {
    it('env development', async () => {
      Config.ENVIRONMENT = 'development'
      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
      Config.ENVIRONMENT = 'production'
    })

    it('app store and current versions are equal', async () => {
      queryService.httpRequest.mockResolvedValueOnce({
        json: () => ({ resultCount: 1, results: [{ version: '1.0.0' }] }),
      })

      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
    })

    it('current versions is newer than apple store version', async () => {
      DeviceInfo.getVersion.mockReturnValueOnce('1.0.1')
      queryService.httpRequest.mockResolvedValueOnce({
        json: () => ({ resultCount: 1, results: [{ version: '1.0.0' }] }),
      })

      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
    })

    it('fetch app info failure', async () => {
      const error = new Error('Itunes store error')
      queryService.httpRequest.mockRejectedValueOnce(error)
      await setupSaga()

      expect(Alert.alert).not.toHaveBeenCalled()
      expect(Logger.captureException).toHaveBeenCalledWith(error)
    })
  })
})
