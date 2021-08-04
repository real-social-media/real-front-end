import { Linking, Alert } from 'react-native'
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import contacts from 'store/ducks/contacts/saga'
import * as authSelectors from 'store/ducks/auth/selectors'
import * as actions from 'store/ducks/contacts/actions'
import * as queries from 'store/ducks/contacts/queries'
import * as queryService from 'services/Query'
import * as LinkingService from 'services/Linking'

jest.spyOn(Alert, 'alert')
jest.spyOn(Linking, 'openURL')
Linking.openURL.mockResolvedValue(true)

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))
jest.mock('store/ducks/auth/selectors', () => ({ authUser: jest.fn() }))
jest.mock('react-native-config', () => ({ APPSTORE_ID: 'APPSTORE_ID', APPSTORE_NAME: 'APPSTORE_NAME' }))

authSelectors.authUser.mockReturnValue({ username: 'username' })

const user = { contactId: 1 }
const emailContact = { value: 'test@email.com', type: 'email' }
const phoneContact = { value: '+12342343', type: 'phone' }
const subject = 'Invite to REAL.app'
const body = `${LinkingService.getStoreLink()}?referralId=username&ls=1`
const emptyInvitedState = { contacts: { invited: { items: [] } } }

describe('Contacts Invite saga', () => {
  it('email type', () => {
    return expectSaga(testAsRootSaga(contacts))
      .withState(emptyInvitedState)

      .call([Linking, 'openURL'], `mailto:${emailContact.value}?subject=${subject}&body=${body}`)
      .not.call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
      .put(actions.contactsInviteSuccess(user))

      .dispatch(actions.contactsInviteRequest({ user, contact: emailContact }))
      .silentRun()
  })

  it('phone type', () => {
    return expectSaga(testAsRootSaga(contacts))
      .withState(emptyInvitedState)

      .call([Linking, 'openURL'], `sms:${phoneContact.value}&body=${body}`)
      .not.call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
      .put(actions.contactsInviteSuccess(user))

      .dispatch(actions.contactsInviteRequest({ user, contact: phoneContact }))
      .silentRun()
  })

  it('not supported type', () => {
    const error = new Error('Invite supports only email and phone type')

    return expectSaga(testAsRootSaga(contacts))
      .withState(emptyInvitedState)

      .not.call([Linking, 'openURL'], `mailto:${emailContact.value}?subject=${subject}&body=${body}`)
      .not.call([Linking, 'openURL'], `sms:${phoneContact.value}&body=${body}`)
      .not.call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
      .put(actions.contactsInviteFailure(error, { contactId: user.contactId }))

      .dispatch(actions.contactsInviteRequest({ user, contact: { type: undefined, value: '' } }))
      .silentRun()
  })
})
