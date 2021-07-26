import { Alert } from 'react-native'
import { call } from 'redux-saga/effects'
import { showMessage } from 'react-native-flash-message'
import pathOr from 'ramda/src/pathOr'
import * as authConstants from 'store/ducks/auth/constants'
import * as usersConstants from 'store/ducks/users/constants'
import * as cacheConstants from 'store/ducks/cache/constants'
import * as postsConstants from 'store/ducks/posts/constants'
import * as themesConstants from 'store/ducks/themes/constants'
import * as walletConstants from 'store/ducks/wallet/constants'
import * as Logger from 'services/Logger'
import { CancelRequestOnSignoutError, UserInNotActiveError, NetworkError, stringifyFailureAction } from 'store/errors'
import messages from 'store/messages'
import { confirm } from 'components/Alert'

const DEFAULT_CODE = 'GENERIC'
const DEFAULT_MESSAGE = 'Oops! Something went wrong'

const BLACKLIST = [
  authConstants.AUTH_GET_USER_FAILURE,
  authConstants.AUTH_FLOW_FAILURE,
  authConstants.AUTH_PREFETCH_FAILURE,
  cacheConstants.CACHE_FETCH_FAILURE,
  postsConstants.POSTS_REPORT_POST_VIEWS_FAILURE,
  usersConstants.USERS_REPORT_SCREEN_VIEWS_FAILURE,
  themesConstants.THEMES_CHECK_DEFAULT_FAILURE,
  walletConstants.WALLET_GET_FAILURE,
]

const getMessageCode = pathOr(DEFAULT_CODE, ['meta', 'messageCode'])
const getDisplayMessage = (action) => pathOr(DEFAULT_MESSAGE, [action.type, getMessageCode(action), 'text'], messages)

async function filterError(action) {
  if (action.payload instanceof CancelRequestOnSignoutError) {
    return true
  }

  if (action.payload instanceof UserInNotActiveError) {
    return true
  }

  if (action.payload instanceof NetworkError) {
    return true
  }

  return BLACKLIST.includes(action.type)
}

function* showError(action) {
  function handleErrorPress() {
    confirm({
      title: 'Show Debug Details',
      desc: 'Please, make screenshot and use it to contact our support',
      onConfirm: () => Alert.alert(stringifyFailureAction(action)),
    })
  }

  yield call(showMessage, {
    type: 'danger',
    icon: 'warning',
    message: getDisplayMessage(action),
    onPress: handleErrorPress,
  })
}

export default function* captureErrors(action) {
  try {
    const skipError = yield call(filterError, action)

    if (skipError) return

    yield call(showError, action)
  } catch (error) {
    Logger.captureException(error)
  }
}
