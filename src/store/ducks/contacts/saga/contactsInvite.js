import { Linking } from 'react-native'
import { put, call, select } from 'redux-saga/effects'
import * as authSelector from 'store/ducks/auth/selectors'
import * as actions from 'store/ducks/contacts/actions'
import path from 'ramda/src/path'
import * as LinkingService from 'services/Linking'

const getContactId = path(['payload', 'user', 'contactId'])

function* contactsInviteRequest(req) {
  const contactId = getContactId(req)

  try {
    const authUser = yield select(authSelector.authUser)
    const subject = 'Invite to REAL.app'
    const body = `${LinkingService.getStoreLink()}?referralId=${authUser.username}&ls=1`
    const { contact } = req.payload

    if (contact.type === 'email') {
      yield call([Linking, 'openURL'], `mailto:${contact.value}?subject=${subject}&body=${body}`)
    } else if (contact.type === 'phone') {
      yield call([Linking, 'openURL'], `sms:${contact.value}&body=${body}`)
    } else {
      throw new Error('Invite supports only email and phone type')
    }

    yield put(actions.contactsInviteSuccess({ contactId }))
  } catch (error) {
    yield put(actions.contactsInviteFailure(error, { contactId }))
  }
}

export default contactsInviteRequest
