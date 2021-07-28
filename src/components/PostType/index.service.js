import { useContext, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import useAppState from 'services/AppState'
import { PERMISSIONS, RESULTS, check, openSettings } from 'react-native-permissions'
import * as navigationActions from 'navigation/actions'
import * as cameraActions from 'store/ducks/camera/actions'
import useLibrary from 'services/providers/Camera/useLibrary'
import { VERIFICATION_TYPE } from 'components/Verification'
import * as VerificationStorage from 'components/Verification/storage'
import { AuthContext } from 'services/providers/Auth'

const PostTypeService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { user } = useContext(AuthContext)
  const [permission, setPermission] = useState(RESULTS.DENIED)

  const checkPermissions = () => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then((result) => setPermission(result))
      .catch(() => {})
  }

  useEffect(() => {
    checkPermissions()
  }, [])

  useAppState({
    onForeground: () => {
      checkPermissions()
    },
  })

  const handleProcessedMedia = (payload) => {
    dispatch(cameraActions.cameraCaptureRequest(payload))
    navigationActions.navigatePostCreate(navigation, { type: 'IMAGE' })
  }

  const library = useLibrary({ handleProcessedMedia })
  const handleManageAccess = () => openSettings()

  const handleClose = () => navigation.popToTop()

  const handleLibrarySnap = async () => {
    handleClose()

    if (await VerificationStorage.isSkipped()) {
      library.handleLibrarySnap()
    } else {
      navigationActions.navigateVerification(navigation, {
        actionType: VERIFICATION_TYPE.CONTINUE,
        handleNext: library.handleLibrarySnap,
      })()

      await VerificationStorage.skipNextTime()
    }
  }

  const handlePhotoTab = () => {
    handleClose()
    navigationActions.navigateCamera(navigation, { multiple: true }, { protected: true, user })()
  }

  const handleTextPostTab = () => {
    handleClose()
    navigationActions.navigatePostCreate(navigation, { type: 'TEXT_ONLY' })
  }

  return children({
    permission,
    handleManageAccess,
    handleLibrarySnap,
    handlePhotoTab,
    handleTextPostTab,
    handleClose,
  })
}

export default PostTypeService
