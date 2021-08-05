import { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import { useNavigation, useRoute } from '@react-navigation/native'
import path from 'ramda/src/path'
import * as navigationActions from 'navigation/actions'
import { useEffectWhenFocused } from 'services/hooks'

const PostMediaService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postId = route.params.postId
  const postUserId = route.params.userId

  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)
  const postsDelete = useSelector(state => state.posts.postsDelete)
  const postsArchive = useSelector(state => state.posts.postsArchive)
  const username = path(['data', 'postedBy', 'username'])(postsSingleGet)

  useEffectWhenFocused(() => {
    if (username) {
      navigation.setOptions({
        title: username,
      })
    }
  }, [username])

  const postsSingleGetRequest = useCallback(({ postId }) =>
    dispatch(postsActions.postsSingleGetRequest({ postId, userId: postUserId }))
  , [])

  useEffect(() => {
    if (!postId || !postUserId) return

    postsSingleGetRequest({ postId })
  }, [postId, postUserId])

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
    postsSingleGet,
    actionSheetRefs,
    textPostRefs,
  })
}

export default PostMediaService

