import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import { useRoute } from '@react-navigation/native'
import { useEffectWhenFocused } from 'services/hooks'

const PostViewsService = ({ children }) => {
  const dispatch = useDispatch()
  const route = useRoute()
  const postId = route.params.postId
  const postsViewsGet = useSelector(postsSelector.postsViewsGetSelector(postId))
  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)
  const usersFollow = useSelector(usersSelector.usersFollow)
  const usersUnfollow = useSelector(usersSelector.usersUnfollow)

  const postsViewsGetRequest = (payload) =>
    dispatch(postsActions.postsViewsGetRequest(payload))

  const postsViewsGetMoreRequest = (payload) =>
    dispatch(postsActions.postsViewsGetMoreRequest(payload))

  useEffectWhenFocused(() => {
    if(!postId) return

    dispatch(postsActions.postsSingleGetRequest({ postId }))
  }, [postId])

  useEffectWhenFocused(() => {
    if (usersFollow.status !== 'success') return
    if (usersUnfollow.status !== 'success') return

    postsViewsGetRequest({ postId })
  }, [usersFollow.status, usersUnfollow.status])

  useEffect(() => {
    postsViewsGetRequest({ postId })
  }, [])

  return children({
    postsViewsGet,
    postsViewsGetRequest,
    postsViewsGetMoreRequest,
    postsSingleGet,
  })
}

export default PostViewsService
