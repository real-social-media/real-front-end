import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as navigationActions from 'navigation/actions'
import * as usersSelector from 'store/ducks/users/selectors'
import HeaderRight from 'navigation/HeaderRight'
import { VERIFICATION_TYPE } from 'components/Verification'
import path from 'ramda/src/path'
import { useEffectWhenFocused } from 'services/hooks'

const ProfilePhotoGridService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const user = useSelector(authSelector.authUser)
  const usersImagePostsGet = useSelector(usersSelector.usersImagePostsGetSelector)
  const usersChangeAvatar = useSelector(usersSelector.usersChangeAvatar)

  const usersImagePostsGetRequest = () => dispatch(usersActions.usersImagePostsGetRequest({ userId: user.userId, isVerified: true }))
  const usersChangeAvatarIdle = () => dispatch(usersActions.usersChangeAvatarIdle())

  useEffect(() => {
    usersImagePostsGetRequest()
  }, [])

  useEffectWhenFocused(() => {
    if (usersChangeAvatar.status === 'success') {
      const backRoute = path(['params', 'backRoute'], route)

      if (backRoute) {
        navigation.navigate(backRoute)
      } else {
        navigation.goBack()
      }

      usersChangeAvatarIdle()
    }
  }, [usersChangeAvatar.status])

  const [selectedPost, setSelectedPost] = useState({})
  const handlePostPress = (post) => setSelectedPost(post)

  const changeAvatarRequest = () =>
    dispatch(usersActions.usersChangeAvatarRequest(selectedPost))

  /**
   *
   */
  const headerRight = () => (
    <HeaderRight
      title="Update"
      onPress={changeAvatarRequest}
      hidden={!selectedPost.postId}
      loading={usersChangeAvatar.status === 'loading'}
    />
  )

  /**
   *
   */
  useEffect(() => {
    navigation.setOptions({
      headerRight,
    })
  }, [selectedPost.postId, usersChangeAvatar.status])

  const handleOpenVerification = navigationActions.navigateVerification(navigation, {
    actionType: VERIFICATION_TYPE.BACK,
  })

  return children({
    usersImagePostsGetRequest,
    usersImagePostsGet,
    handlePostPress,
    selectedPost,
    handleOpenVerification,
  })
}

export default ProfilePhotoGridService
