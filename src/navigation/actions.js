import { Platform } from 'react-native'
import { navigateToPath, pushToPath } from 'navigation/helpers'
import * as UserService from 'services/User'

const isWeb = Platform.OS === 'web'

const mockPathForWeb = path => isWeb ? 'DownloadApp' : path
export const mockForWeb = (callback, navigation) => isWeb ? () => navigateDownloadApp(navigation) : callback

export const withAuthValidation = (callback) => {
  return (navigation, params = {}, meta = {}) => {
    return () => {
      if (!meta.protected) {
        return callback(navigation, params)
      }

      if (UserService.isUserActive(meta.user)) {
        return callback(navigation, params)
      }

      return navigateProfileUpgrade(navigation)
    }
  }
}

const withDatingValidation = (callback) => {
  return (navigation, params = {}, meta = {}) => {
    if (!UserService.isUserActive(meta.user)) {
      return navigateProfileUpgrade(navigation)
    } else if (UserService.isUserEnableDating(meta.user)) {
      return callback(navigation, params)
    } else {
      return navigateDatingWizard(navigation, params)
    }
  }
}

/**
 * Common
 */
export const navigateProfile = pushToPath('Profile')
export const navigatePostMedia = pushToPath('PostMedia')
export const navigatePostExplore = pushToPath('PostExplore')
export const navigateProfileFollowed = pushToPath('ProfileFollowed')
export const navigateProfileFollower = pushToPath('ProfileFollower')
export const navigatePostViews = pushToPath('PostViews')
export const navigatePostLikes = pushToPath('PostLikes')
export const navigatePostShare = pushToPath('PostShare')
export const navigatePostCreate = navigateToPath('PostCreate')
export const navigateAlbum = pushToPath('Album')
export const navigateAlbums = navigateToPath('Albums')
export const navigateAlbumCreate = navigateToPath('AlbumCreate')
export const navigateAlbumEdit = navigateToPath('AlbumEdit')
export const navigatePostEdit = navigateToPath('PostEdit')

/**
 * Nested Routes
 */
export const navigateNestedPost = navigateToPath('App.Root.PostMedia')
export const navigateNestedPostViews = navigateToPath('App.Root.PostViews')
export const navigateNestedComments = navigateToPath('App.Root.Comments')
export const navigateNestedPostLikes = navigateToPath('App.Root.PostLikes')

/**
 * Chat
 */
export const navigateChat = withAuthValidation(navigateToPath('App.Chat'))
export const navigateChatDirect = withAuthValidation(navigateToPath('App.Chat.ChatDirect'))
export const navigateChatOptions = withAuthValidation(navigateToPath('App.Chat.ChatOptions'))
export const navigateProfileRequests = navigateToPath('App.Chat.ProfileRequests')

/**
 * Dating
 */
export const navigateDating = withDatingValidation(navigateToPath(mockPathForWeb('Dating.Dating')))
export const navigateDatingAbout = withAuthValidation(navigateToPath(mockPathForWeb('DatingAbout')))
export const navigateDatingMatch = withAuthValidation(navigateToPath(mockPathForWeb('DatingMatch')))
export const navigateDatingProfile = withAuthValidation(navigateToPath(mockPathForWeb('DatingProfile')))
export const navigateDatingSettings = withAuthValidation(navigateToPath(mockPathForWeb('DatingSettings')))
export const navigateDatingWizard = navigateToPath(mockPathForWeb('Dating.DatingWizard'))

/**
 * Profile
 */
export const navigateProfileSelf = withAuthValidation(navigateToPath('App.Root.Home.Profile.ProfileSelf'))
export const navigateSettings = withAuthValidation(navigateToPath('App.Root.Home.Profile.Settings'))
export const navigateProfilePhotoUpload = withAuthValidation(navigateToPath(mockPathForWeb('App.Root.Home.Profile.ProfilePhotoUpload')))
export const navigateProfilePhoto = navigateToPath(mockPathForWeb('App.Root.Home.Profile.ProfilePhoto'))
export const navigateProfilePhotoGrid = navigateToPath('App.Root.Home.Profile.ProfilePhotoGrid')
export const navigateProfileEdit = navigateToPath('App.Root.Home.Profile.ProfileEdit')
export const navigateInviteFriends = withAuthValidation(navigateToPath(mockPathForWeb('InviteFriends')))
export const navigateInviteFriendsSuccess = navigateToPath(mockPathForWeb('InviteFriendsSuccess'))
export const navigateTheme = navigateToPath('Theme')
export const navigatePrivacy = navigateToPath('App.Root.Home.Profile.Privacy')
export const navigateMembership = navigateToPath('Membership')
export const navigateArchived = navigateToPath('App.Root.Home.Profile.Archived')

/**
 * Auth
 */
export const navigateAuthHome = navigateToPath('Auth.AuthHome')
export const navigateAuthUsername = navigateToPath('Auth.AuthUsername')
export const navigateAuthPhoneConfirm = navigateToPath('Auth.AuthPhoneConfirm')
export const navigateAuthPassword = navigateToPath('Auth.AuthPassword')
export const navigateAuthEmailConfirm = navigateToPath('Auth.AuthEmailConfirm')
export const navigateAuthForgotConfirm = navigateToPath('Auth.AuthForgotConfirm')

/**
 * Signin
 */
export const navigateSignin = navigateToPath('Auth.Signin')
export const navigateAuthSigninPhone = navigateToPath('Auth.Signin.AuthSigninPhone')
export const navigateAuthSigninEmail = navigateToPath('Auth.Signin.AuthSigninEmail')

/**
 * Signup
 */
export const navigateSignup = navigateToPath('Auth.Signup')
export const navigateAuthPhone = navigateToPath('Auth.Signup.AuthPhone')
export const navigateAuthEmail = navigateToPath('Auth.Signup.AuthEmail')

/**
 * Forgot
 */
export const navigateForgot = navigateToPath('Auth.Forgot')
export const navigateAuthForgotEmail = navigateToPath('Auth.Forgot.AuthForgotEmail')
export const navigateAuthForgotPhone = navigateToPath('Auth.Forgot.AuthForgotPhone')

/**
 * Root
 */
export const navigateProfileUpgrade = navigateToPath('App.Root.ProfileUpgrade')
export const navigatePostType = withAuthValidation(navigateToPath(mockPathForWeb('App.Root.PostType')))
export const navigateStory = withAuthValidation(pushToPath('Story'))
export const navigateVerification = withAuthValidation(navigateToPath('Verification'))
export const navigateComments = withAuthValidation(pushToPath('Comments'))

/**
 * Search
 */
export const navigateSearch = navigateToPath('App.Root.Home.Search')
export const navigatePostsFilters = navigateToPath('PostsFilters')



/**
 * Other
 */
export const navigateBack = (navigation) => navigation.goBack()
export const navigateApp = navigateToPath('App')
export const navigateResetToApp = (navigation) => navigation.reset({ index: 0, routes: [{ name: 'App' }] })
export const navigateHome = navigateToPath('App.Root.Home.Feed.Feed')
export const navigateCamera = withAuthValidation(navigateToPath(mockPathForWeb('Camera')))
export const navigatePayout = withAuthValidation(navigateToPath('Payout'))
export const navigatePayouts = withAuthValidation(navigateToPath('Payouts'))
export const navigatePromocodes = withAuthValidation(navigateToPath('Promocodes'))
export const navigateReset = (navigation) => navigation.reset({ index: 0, routes: [{ name: 'Auth' }] })
export const navigateThemeDefault = navigateToPath('ThemeDefault')
export const navigateDownloadApp = navigateToPath('DownloadApp')
