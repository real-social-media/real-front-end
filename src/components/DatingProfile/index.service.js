import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as usersSelector from 'store/ducks/users/selectors'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import { useEffectWhenFocused } from 'services/hooks'

const DatingProfileService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUser)
  const usersSetUserDatingStatus = useSelector(usersSelector.usersSetUserDatingStatus)
  const usersImagePostsGet = useSelector(usersSelector.usersImagePostsGetSelector)

  const usersSetUserDatingStatusRequest = () =>
    dispatch(usersActions.usersSetUserDatingStatusRequest({ status: 'ENABLED' }))

  useEffectWhenFocused(() => {
    if (usersSetUserDatingStatus.status === 'success') {
      dispatch(usersActions.usersSetUserDatingStatusIdle())
      navigationActions.navigateDating(navigation, {}, { user })
    }
  }, [usersSetUserDatingStatus.status])

  useEffect(() => {
    dispatch(authActions.authGetUserRequest())
    dispatch(usersActions.usersImagePostsGetRequest({ userId: user.userId, isVerified: true }))
  }, [])

  useFocusEffect(
    useCallback(() => {
      dispatch(usersActions.usersSetUserDatingStatusIdle())
    }, []),
  )

  return children({
    user,
    navigation,
    usersSetUserDatingStatus,
    usersSetUserDatingStatusRequest,
    usersImagePostsGet,
  })
}

export default DatingProfileService
