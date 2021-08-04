import UrlPattern from 'url-pattern'
import Config from 'react-native-config'
import { Linking, Platform } from 'react-native'
import * as navigationActions from 'navigation/actions'
import * as Logger from 'services/Logger'
import { NotSupportedInAppCardError } from 'store/errors'

export const getStoreLink = () => {
  if (Platform.OS === 'ios') {
    return `itms-apps://itunes.apple.com/app/id${Config.APPSTORE_ID}`
  } else {
    return `https://apps.apple.com/us/app/${Config.APPSTORE_NAME}/id${Config.APPSTORE_ID}`
  }
}

const options = { segmentValueCharset: ':a-zA-Z0-9_-' }

const ACTIONS = {
  POST: 'post',
  PROFILE_PHOTO: 'profilePhoto',
  INVITE_FRIENDS: 'inviteFriends',
  SIGNUP: 'signup',
  CHATS: 'chats',
  COMMENTS: 'comments',
  VIEWS: 'views',
  LIKES: 'likes',
  DIAMOND: 'diamond',
  NEW_FOLLOWERS: 'newFollowers',
}

const PATTERNS = {
  [ACTIONS.POST]: new UrlPattern('*/user/(:userId)/post/(:postId)((/):action)(/)((/):actionId)(/)', options),
  [ACTIONS.PROFILE_PHOTO]: new UrlPattern('*/user/:userId/settings/photo(/)', options),
  [ACTIONS.INVITE_FRIENDS]: new UrlPattern('*/user/:userId/settings/contacts(/)', options),
  [ACTIONS.SIGNUP]: new UrlPattern('*/signup/:userId(/)', options),
  [ACTIONS.NEW_FOLLOWERS]: new UrlPattern('*/user/:userId/new_followers(/)', options),
  [ACTIONS.CHATS]: new UrlPattern('*/chat(/)', options),
  [ACTIONS.DIAMOND]: new UrlPattern('*/diamond(/)', options),
}

export const deeplinkPath = (action) => {
  for (const key of Object.keys(PATTERNS)) {
    const pattern = PATTERNS[key]
    const match = pattern.match(action)

    if (match !== null) {
      return { action: key, ...match }
    }
  }

  throw new NotSupportedInAppCardError('The in-app card is not supported')
}

export const isCardSupported = (card) => {
  try {
    return deeplinkPath(card.action)
  } catch (error) {
    return false
  }
}

export const isDiamondCard = (card) => deeplinkPath(card.action).action === ACTIONS.DIAMOND

export const deeplinkNavigation = (navigation) => (action) => {
  try {
    const params = deeplinkPath(action)

    switch (params.action) {
      case ACTIONS.CHATS:
        navigationActions.navigateChat(navigation)()
        break
      case ACTIONS.COMMENTS:
        navigationActions.navigateNestedComments(navigation, params)
        break
      case ACTIONS.VIEWS:
        navigationActions.navigateNestedPostViews(navigation, params)
        break
      case ACTIONS.LIKES:
        navigationActions.navigateNestedPostLikes(navigation, params)
        break
      case ACTIONS.POST:
        navigationActions.navigateNestedPost(navigation, params)
        break
      case ACTIONS.PROFILE_PHOTO:
        navigationActions.navigateProfilePhoto(navigation, params)
        break
      case ACTIONS.INVITE_FRIENDS:
        navigationActions.navigateInviteFriends(navigation, params)()
        break
      case ACTIONS.SIGNUP:
        navigationActions.navigateProfileUpgrade(navigation, params)
        break
      case ACTIONS.DIAMOND:
        navigationActions.navigateInviteFriendsSuccess(navigation)
        break
      case ACTIONS.NEW_FOLLOWERS:
        navigationActions.navigateProfileFollower(navigation, params)
        break
      default:
        break
    }
  } catch (error) {
    Logger.withScope((scope) => {
      scope.setExtra('action', action)
      scope.setExtra('code', error.code)
      scope.setExtra('message', error.message)
      Logger.captureMessage('FEED_CARDS_UNSUPPORTED_CARD')
    })

    if (error.code === 'NOT_SUPPORTED_IN_APP_CARD_ERROR') {
      return Linking.openURL(action)
    }
  }
}
