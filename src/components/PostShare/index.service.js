import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as navigationActions from 'navigation/actions'
import { useRoute, useNavigation } from '@react-navigation/native'
import path from 'ramda/src/path'
import * as postsSelector from 'store/ducks/posts/selectors'
import { useEffectWhenFocused } from 'services/hooks'

const ShareService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postId = path(['params', 'postId'])(route)
  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)
  const postsShare = useSelector((state) => state.posts.postsShare)

  const postsShareRequest = (payload) => dispatch(postsActions.postsShareRequest(payload))

  useEffectWhenFocused(() => {
    if (!postId) return

    dispatch(postsActions.postsSingleGetRequest({ postId }))
  }, [postId])

  useEffectWhenFocused(() => {
    if (postsShare.status === 'success') {
      dispatch(postsActions.postsShareIdle())

      if (postsShare.payload.type !== 'repost') {
        navigationActions.navigateBack(navigation)
      }
    }
  }, [postsShare.status])

  return children({
    postsSingleGet,
    postsShare,
    postsShareRequest,
    route,
  })
}

export default ShareService
