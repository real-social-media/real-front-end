import * as usersSingle from 'store/ducks/users/queries/single'
import {
  userFragment,
} from 'store/fragments'

export const self = `
  query self {
    self {
      ...userFragment
    }
  }
  ${userFragment}
`

export const linkAppleLogin = `
  mutation linkAppleLogin($appleIdToken: String!) {
    linkAppleLogin(appleIdToken: $appleIdToken) {
      ...singleUserFragment
    }
  }
  ${usersSingle.singleUserFragment}
`

export const linkGoogleLogin = `
  mutation linkGoogleLogin($googleIdToken: String!) {
    linkGoogleLogin(googleIdToken: $googleIdToken) {
      ...singleUserFragment
    }
  }
  ${usersSingle.singleUserFragment}
`

export const createAnonymousUser = `
  mutation createAnonymousUser {
    createAnonymousUser {
      AccessToken
      ExpiresIn
      TokenType
      RefreshToken
      IdToken
    }
  }
`

export const setFullname = `
  mutation setFullname($fullName: String) {
    setUserDetails(fullName: $fullName) {
      ...singleUserFragment
    }
  }
  ${usersSingle.singleUserFragment}
`
