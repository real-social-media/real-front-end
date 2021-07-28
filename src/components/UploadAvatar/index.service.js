import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as helpers from 'components/UploadAvatar/helpers'
import * as navigationActions from 'navigation/actions'
import * as cameraActions from 'store/ducks/camera/actions'
import useLibrary from 'services/providers/Camera/useLibrary'
import path from 'ramda/src/path'

const useProfilePhoto = (props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUser)
  const isAvatarEmpty = helpers.isAvatarEmpty(user)
  const avatarUrl = path(['photo', 'url480p'])(user)
  const backRoute = path(['backRoute'], props)
  const multiple = false

  const handleProcessedPhoto = (payload) => {
    dispatch(cameraActions.cameraCaptureRequest(payload))
    navigationActions.navigateProfilePhotoUpload(navigation, {
      backRoute,
    })()
  }

  const { handleLibrarySnap } = useLibrary({
    handleProcessedPhoto,
    multiple,
    customPickerOptions: {
      mediaType: 'photo',
    },
  })

  const navigateCamera = navigationActions.navigateCamera(
    navigation,
    { nextRoute: 'ProfilePhotoUpload', backRoute, multiple },
    { protected: true, user },
  )

  const handleSkipUpload = () => navigation.goBack()
  const usersDeleteAvatarRequest = () => dispatch(usersActions.usersDeleteAvatarRequest())
  const navigateProfilePhotoGrid = () => navigationActions.navigateProfilePhotoGrid(navigation, { backRoute })

  return {
    user,
    navigation,
    handleLibrarySnap,
    navigateCamera,
    handleSkipUpload,
    usersDeleteAvatarRequest,
    navigateProfilePhotoGrid,
    isAvatarEmpty,
    avatarUrl,
  }
}

export default useProfilePhoto
