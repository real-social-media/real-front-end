import { useSelector } from 'react-redux'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersSelector from 'store/ducks/users/selectors'

const StoriesService = ({ children }) => {
  const usersGetFollowedUsersWithStories = useSelector(usersSelector.usersGetFollowedUsersWithStoriesSelector)
  const user = useSelector(authSelector.authUser)

  return children({
    user,
    usersGetFollowedUsersWithStories,
  })
}

export default StoriesService
