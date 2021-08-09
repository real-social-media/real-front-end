import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as usersActions from 'store/ducks/users/actions'
import * as chatActions from 'store/ducks/chat/actions'
import { useScrollToTop } from '@react-navigation/native'
import pathOr from 'ramda/src/pathOr'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as authSelector from 'store/ducks/auth/selectors'
import useFeed from 'services/hooks/useFeed'

const FeedService = ({ children }) => {
  const dispatch = useDispatch()
  const {
    feedRef,
    handleScrollPrev,
    handleScrollNext,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  } = useFeed()

  const postsFeedGet = useSelector(postsSelector.postsFeedGetSelector)
  const postsCreate = useSelector(postsSelector.postsCreate)

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

  const postsFeedGetMoreRequest = useCallback((payload) => dispatch(postsActions.postsFeedGetMoreRequest(payload)), [])

  /**
   * You are all caught up separator position
   */
  const bookmarkSeparatorIndex = useMemo(
    () => pathOr([], ['data'])(postsFeedGet).findIndex((post) => post.viewedStatus === 'VIEWED'),
    [postsFeedGet.data],
  )

  /**
   * FlatList feed ref, used for scroll to top on tab bar press
   */
  useScrollToTop(feedRef)

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
