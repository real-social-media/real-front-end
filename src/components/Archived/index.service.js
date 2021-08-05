import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as authSelector from 'store/ducks/auth/selectors'

const ProfileArchivedService = ({ children }) => {
  const dispatch = useDispatch()
  const postsGetArchived = useSelector(postsSelector.postsGetArchivedSelector)
  const user = useSelector(authSelector.authUser)

  const postsGetArchivedRequest = () =>
    dispatch(postsActions.postsGetArchivedRequest({ userId: user.userId }))

  useEffect(() => {
    postsGetArchivedRequest()
  }, [])

  return children({
    postsGetArchived,
    postsGetArchivedRequest,
  })
}

export default ProfileArchivedService
