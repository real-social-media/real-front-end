import { useRef, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as usersActions from 'store/ducks/users/actions'
import * as chatActions from 'store/ducks/chat/actions'
import { useScrollToTop } from '@react-navigation/native'
import pathOr from 'ramda/src/pathOr'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as authSelector from 'store/ducks/auth/selectors'

const FeedService = ({ children }) => {
  const dispatch = useDispatch()

  const postsFeedGetSelector = useCallback(postsSelector.postsFeedGetSelector(), [])
  const postsFeedGet = useSelector(postsFeedGetSelector)

  const postsCreateSelector = useCallback(postsSelector.postsCreate, [])
  const postsCreate = useSelector(postsCreateSelector)

  const userId = useSelector(authSelector.authUserId)

  const updateRelatedData = useCallback(() => {
    dispatch(usersActions.usersGetCardsRequest())

    if (userId) {
      dispatch(postsActions.postsGetUnreadCommentsRequest())
      dispatch(usersActions.usersGetFollowedUsersWithStoriesRequest())
      dispatch(usersActions.usersGetPendingFollowersRequest({ userId }))
      dispatch(chatActions.chatGetChatsRequest())
    }
  }, [userId])

  const loadInit = useCallback((payload) => {
    dispatch(postsActions.postsFeedGetRequest(payload))
    updateRelatedData()
  }, [])

  const postsFeedGetMoreRequest = useCallback((payload) =>
    dispatch(postsActions.postsFeedGetMoreRequest(payload))
  , [])

  const handleScrollPrev = useCallback((index) => () => {
    try {
      feedRef.current.scrollToIndex({
        index: index - 1,
        viewPosition: 0.5,
      })
    } catch (error) {
      // ignore
    }
  }, [])

  const handleScrollNext = useCallback((index) => () => {
    try {
      feedRef.current.scrollToIndex({
        index: index + 1,
        viewPosition: 0.5,
      })
    } catch (error) {
      // ignore
    }
  }, [])

  /**
   * You are all caught up separator position
   */
  const bookmarkSeparatorIndex = useMemo(() =>
    pathOr([], ['data'])(postsFeedGet).findIndex(post => post.viewedStatus === 'VIEWED')
  , [postsFeedGet.data])

  /**
   * FlatList feed ref, used for scroll to top on tab bar press
   */
  const feedRef = useRef(null)
  useScrollToTop(feedRef)

  /**
   * Post header dropdown ref, used for header actions dropdown
   */
  const actionSheetRefs = useRef({})

  /**
   * Text only post ref, used for rendering textonly post component into image
   */
  const textPostRefs = useRef({})

  const createActionSheetRef = useCallback(post => element => {
    if (!actionSheetRefs.current[post.postId]) {
      actionSheetRefs.current[post.postId] = element
    }
  }, [])

  const getActionSheetRef = useCallback(
    post => actionSheetRefs.current[post.postId]
  , [])

  const createTextPostRef = useCallback(
    post => element => {
      if (!textPostRefs.current[post.postId]) {
        textPostRefs.current[post.postId] = element
      }
    }
  , [])

  const getTextPostRef = useCallback(
    post => textPostRefs.current[post.postId]
  , [])

  return children({
    postsFeedGet,
    loadInit,
    postsFeedGetMoreRequest,
    postsCreate,
    handleScrollPrev,
    handleScrollNext,
    bookmarkSeparatorIndex,
    feedRef,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  })
}

export default FeedService
