import { call, takeLatest } from 'redux-saga/effects'
import { Alert, Linking, NativeModules } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'
import * as Logger from 'services/Logger'
import * as queryService from 'services/Query'
import * as constants from 'store/ducks/updates/constants'
import * as LinkingService from 'services/Linking'

export function isNewerThan(v1, v2) {
  v1 = v1.split('.').map((i) => parseInt(i, 10))
  v2 = v2.split('.').map((i) => parseInt(i, 10))

  for (var i = 0; i < Math.max(v1.length, v2.length); i++) {
    if (!v1[i] && v1[i] !== 0) return false
    if (!v2[i] && v2[i] !== 0) return true
    if (v1[i] > v2[i]) return true
    if (v1[i] < v2[i]) return false
  }

  return false
}

async function getVersionFromStore() {
  const bundleId = DeviceInfo.getBundleId()
  const country = NativeModules.RNLocalize.initialConstants.country

  const url = `https://itunes.apple.com/lookup?bundleId=${bundleId}&country=${country}`
  const response = await queryService.httpRequest(url, { cache: 'no-store' })
  const { resultCount, results } = await response.json()

  if (resultCount) {
    return results[0].version
  } else {
    throw new Error('There is no info about the app')
  }
}

async function needUpdate() {
  if (Config.ENVIRONMENT !== 'production') return

  const storeVersion = await getVersionFromStore()
  const currentVersion = DeviceInfo.getVersion()

  return isNewerThan(storeVersion, currentVersion)
}

function showUpdateAlert() {
  const title = 'App Update Available'
  const subtitle = 'Please update REAL to continue'
  const updateBtn = {
    text: 'Update Now',
    onPress: () => Linking.openURL(LinkingService.getStoreLink()),
    style: 'cancel',
  }

  Alert.alert(title, subtitle, [updateBtn], { cancelable: false })
}

function* updatesCheckRequest() {
  try {
    const forceUpdate = yield call(needUpdate)

    if (forceUpdate) {
      yield call(showUpdateAlert)
    }
  } catch (error) {
    Logger.captureException(error)
  }
}

export default () => [takeLatest(constants.UPDATES_CHECK_REQUEST, updatesCheckRequest)]
