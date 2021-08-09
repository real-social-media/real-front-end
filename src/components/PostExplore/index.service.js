import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import { useEffectWhenFocused } from 'services/hooks'
import useFeed from 'services/hooks/useFeed'

const PostExploreService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postId = route.params.postId

  const postsFlag = useSelector((state) => state.posts.postsFlag)
  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)
  const postsSimilar = useSelector(postsSelector.postsSimilarSelector)
  const postsDelete = useSelector((state) => state.posts.postsDelete)
  const postsArchive = useSelector((state) => state.posts.postsArchive)

  const {
    feedRef,
    handleScrollPrev,
    handleScrollNext,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  } = useFeed()

  // useEffectWhenFocused(() => {
  //   if (username) {
  //     navigation.setOptions({
  //       title: username,
  //     })
  //   }
  // }, [username])

  const [postsSingleGetRequest, postsSimilarRequest, postsSimilarMoreRequest] = useMemo(
    () => [
      () => dispatch(postsActions.postsSingleGetRequest({ postId })),
      () => dispatch(postsActions.postsSimilarRequest({ postId })),
      ({ nextToken }) => dispatch(postsActions.postsSimilarMoreRequest({ postId, nextToken })),
    ],
    [postId],
  )

  useEffectWhenFocused(() => {
    if (postsDelete.status === 'loading') {
      navigationActions.navigateBack(navigation)
    }
    if (postsArchive.status === 'loading') {
      navigationActions.navigateBack(navigation)
    }
  }, [postsDelete.status, postsArchive.status])

  return children({
    feedRef,
    handleScrollPrev,
    handleScrollNext,
    postsFlag,
    postsSimilar,
    postsSingleGet,
    postsSingleGetRequest,
    postsSimilarRequest,
    postsSimilarMoreRequest,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  })
}

export default PostExploreService
