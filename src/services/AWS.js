import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import Config from 'react-native-config'
import * as Google from 'services/Google'
import * as Apple from 'services/Apple'
import DeviceInfo from 'react-native-device-info'
import { getReadableVersion } from 'services/OTA'

const headers = {
  'x-real-version': getReadableVersion(),
  'x-real-device': DeviceInfo.getDeviceId(),
  'x-real-system': DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion(),
  'x-real-uid': DeviceInfo.getUniqueId(),
}

/**
 * AWS Configuration
 */
export const amplifyConfig = () => {
  const config = {
    Auth: {
      region: Config.AWS_COGNITO_REGION,
      userPoolId: Config.AWS_COGNITO_USER_POOL_ID,
      userPoolWebClientId: Config.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
      identityPoolId: Config.AWS_COGNITO_IDENTITY_POOL_ID,
      refreshHandlers: {
        'google': Google.refresh,
        'appleid.apple.com': Apple.refresh,
        // [`cognito-idp.${Config.AWS_COGNITO_REGION}.amazonaws.com/${Config.AWS_COGNITO_USER_POOL_ID}`]: console.log,
      },
    },
    API: {
      aws_appsync_graphqlEndpoint: Config.AWS_APPSYNC_GRAPHQL_ENDPOINT,
      aws_appsync_region: Config.AWS_COGNITO_REGION,
      aws_appsync_authenticationType: Config.AWS_APPSYNC_AUTHENTICATION_TYPE,
      aws_appsync_apiKey: 'null',
      graphql_headers: () => headers,
      endpoints: [
        {
            name: 'REAL_TRANSACTIONS_API',
            endpoint: Config.REAL_TRANSACTIONS_API,
        },
      ],
    },
  }

  Amplify.configure(config)
}

export const federatedGoogleSignin = Google.signin
export const federatedGoogleSignout = Google.signout

export const federatedAppleSignin = Apple.signin
export const federatedAppleSignout = Apple.signout


export const validateUserExistance = async (userPayload) => {
  try {
    /**
     * If set to False, the API will throw an AliasExistsException error if the phone number/email used already exists as an alias with a different user
     */
    await Auth.confirmSignUp(userPayload.email, '000000', {
      forceAliasCreation: false,
    })
  } catch (error) {
    return error.code !== 'UserNotFoundException'
  }
}
