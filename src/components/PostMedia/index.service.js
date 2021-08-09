import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import { useEffectWhenFocused } from 'services/hooks'
import useFeed from 'services/hooks/useFeed'

const PostMediaService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postId = route.params.postId

  const postsFlag = useSelector((state) => state.posts.postsFlag)
  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)
  const postsDelete = useSelector((state) => state.posts.postsDelete)
  const postsArchive = useSelector((state) => state.posts.postsArchive)
  const username = postsSingleGet.data?.postedBy?.username

  const postsSingleGetRequest = () => dispatch(postsActions.postsSingleGetRequest({ postId }))

  const { createActionSheetRef, getActionSheetRef, createTextPostRef, getTextPostRef } = useFeed()

  useEffectWhenFocused(() => {
    if (username) {
      navigation.setOptions({
        title: username,
      })
    }
  }, [username])

  useEffect(() => {
    if (!postId) return

    postsSingleGetRequest()
  }, [])

  useEffectWhenFocused(() => {
    if (postsDelete.status === 'loading') {
      navigationActions.navigateBack(navigation)
    }
    if (postsArchive.status === 'loading') {
      navigationActions.navigateBack(navigation)
    }
  }, [postsDelete.status, postsArchive.status])

  return children({
    postsFlag,
    postsSingleGet,
    postsSingleGetRequest,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  })
}

export default PostMediaService
