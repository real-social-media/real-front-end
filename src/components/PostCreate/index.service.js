import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authSelector from 'store/ducks/auth/selectors'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as albumsSelector from 'store/ducks/albums/selectors'
import * as albumsActions from 'store/ducks/albums/actions'
import * as navigationActions from 'navigation/actions'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as postsActions from 'store/ducks/posts/actions'
import * as walletActions from 'store/ducks/wallet/actions'
import * as walletSelector from 'store/ducks/wallet/selectors'
import path from 'ramda/src/path'
import { VERIFICATION_TYPE } from 'components/Verification'

const PostCreateService = ({
  children,
}) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()

  const user = useSelector(authSelector.authUser)
  const coinsOptions = useSelector(walletSelector.walletCoinsOptions)
  const postsCreate = useSelector(postsSelector.postsCreate)
  const cameraCapture = useSelector(state => state.camera.cameraCapture)
  const albumsGet = useSelector(albumsSelector.albumsGetSelector(user.userId))
  const type = route.params.type
  const cameraCaptureLength = path(['data', 'length'])(cameraCapture)

  /**
   * Navigate to home page once upload is complete
   */
  const handlePostUploadStarted = (post) => {
    if (post.postType === 'TEXT_ONLY') {
      navigationActions.navigateHome(navigation)
    }
    if (post.postType === 'IMAGE' && cameraCaptureLength === 1) {
      navigationActions.navigateHome(navigation)
    }
  }

  /**
   *
   */
  useEffect(() => {
    if(!user.userId) return

    dispatch(walletActions.walletGetRequest())
    dispatch(albumsActions.albumsGetRequest({ userId: user.userId }))
  }, [])

  const postsCreateRequest = (payload) => {
    dispatch(postsActions.postsCreateRequest(payload))

    handlePostUploadStarted(payload)
  }

  const handleOpenVerification = navigationActions.navigateVerification(navigation, {
    actionType: VERIFICATION_TYPE.BACK,
    showHeader: true,
  })

  return children({
    type,
    albumsGet,
    user,
    postsCreate,
    postsCreateRequest,
    cameraCapture: path(['data', 0])(cameraCapture),
    cameraCaptureLength,
    handleOpenVerification,
    coinsOptions,
  })
}

export default PostCreateService
