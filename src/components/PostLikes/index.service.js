import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import { useRoute } from '@react-navigation/native'
import { useEffectWhenFocused } from 'services/hooks'

const PostsLikesService = ({ children }) => {
  const dispatch = useDispatch()
  const route = useRoute()
  const postId = route.params.postId
  const postsLikesGet = useSelector(postsSelector.postsLikesGetSelector(postId))
  const usersFollow = useSelector(usersSelector.usersFollow)
  const usersUnfollow = useSelector(usersSelector.usersUnfollow)

  const postsLikesGetRequest = (payload) =>
    dispatch(postsActions.postsLikesGetRequest(payload))

  useEffectWhenFocused(() => {
    if(!postId) return

    dispatch(postsActions.postsSingleGetRequest({ postId }))
  }, [postId])

  useEffectWhenFocused(() => {
    if (usersFollow.status !== 'success') return
    if (usersUnfollow.status !== 'success') return

    postsLikesGetRequest({ postId })
  }, [usersFollow.status, usersUnfollow.status])

  useEffect(() => {
    postsLikesGetRequest({ postId })
  }, [])

  return children({
    postsLikesGet,
  })
}

export default PostsLikesService
