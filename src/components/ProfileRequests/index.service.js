import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import { useEffectWhenFocused } from 'services/hooks'

const ProfileFollowerService = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector(authSelector.authUser)
  const userId = user.userId
  const usersGetPendingFollowers = useSelector(usersSelector.usersGetPendingFollowersSelector)
  const usersFollow = useSelector(usersSelector.usersFollow)
  const usersUnfollow = useSelector(usersSelector.usersUnfollow)

  const usersGetPendingFollowersRequest = (payload) =>
    dispatch(usersActions.usersGetPendingFollowersRequest(payload))

  useEffectWhenFocused(() => {
    if (usersFollow.status === 'success') {
      usersGetPendingFollowersRequest({ userId })
    }
    if (usersUnfollow.status === 'success') {
      usersGetPendingFollowersRequest({ userId })
    }
  }, [usersFollow.status, usersUnfollow.status])

  useEffectWhenFocused(() => {
    if(!userId) return
    usersGetPendingFollowersRequest({ userId })
  }, [userId])

  return children({
    usersGetPendingFollowers,
  })
}

export default ProfileFollowerService

