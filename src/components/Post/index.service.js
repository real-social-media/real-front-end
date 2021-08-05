import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'

const PostsService = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUser)
  const postsAnonymouslyLike = useSelector(state => state.posts.postsAnonymouslyLike)
  const postsFlag = useSelector(state => state.posts.postsFlag)

  const postsOnymouslyLikeRequest = useCallback((payload) =>
    dispatch(postsActions.postsOnymouslyLikeRequest(payload))
  , [])

  const postsDislikeRequest = useCallback((payload) =>
    dispatch(postsActions.postsDislikeRequest(payload))
  , [])

  const postsArchiveRequest = useCallback((payload) =>
    dispatch(postsActions.postsArchiveRequest(payload))
  , [])

  const postsRestoreArchivedRequest = useCallback((payload) =>
    dispatch(postsActions.postsRestoreArchivedRequest(payload))
  , [])

  const postsFlagRequest = useCallback((payload) =>
    dispatch(postsActions.postsFlagRequest(payload))
  , [])

  const postsDeleteRequest = useCallback((payload) =>
    dispatch(postsActions.postsDeleteRequest(payload))
  , [])

  const changeAvatarRequest = useCallback((post) =>
    dispatch(usersActions.usersChangeAvatarRequest(post))
  , [])

  return children({
    user,
    postsAnonymouslyLike,
    postsOnymouslyLikeRequest,
    postsDislikeRequest,
    postsArchiveRequest,
    postsRestoreArchivedRequest,
    postsFlag,
    postsFlagRequest,
    postsDeleteRequest,
    changeAvatarRequest,
  })
}

export default PostsService
