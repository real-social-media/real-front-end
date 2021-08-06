import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import { useEffectWhenFocused } from 'services/hooks'

const PostMediaService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postId = route.params.postId

  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)
  const postsDelete = useSelector(state => state.posts.postsDelete)
  const postsArchive = useSelector(state => state.posts.postsArchive)

  const postsSingleGetRequest = () => dispatch(postsActions.postsSingleGetRequest({ postId }))

  useEffectWhenFocused(() => {
    if (username) {
      navigation.setOptions({
        title: username,
      })
    }
  }, [username])

  useEffect(() => {
    postsSingleGetRequest()
  }, [])

  useEffectWhenFocused(() => {
    if (postsDelete.status === 'loading') {
      navigationActions.navigateBack(navigation)
    }
    if (postsArchive.status === 'loading') {
      navigationActions.navigateBack(navigation)
    }
  }, [
    postsDelete.status,
    postsArchive.status,
  ])

  /**
   * Post header dropdown ref, used for header actions dropdown
   */
  const actionSheetRefs = useRef([])

  /**
   * Text only post ref, used for rendering textonly post component into image
   */
  const textPostRefs = useRef([])

  return children({
    postsSimilar,
    postsSingleGet,
    actionSheetRefs,
    textPostRefs,
    postsSingleGetRequest,
  })
}

export default PostMediaService

