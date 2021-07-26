import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import { useNavigation, useScrollToTop } from '@react-navigation/native'
import path from 'ramda/src/path'
import * as authSelector from 'store/ducks/auth/selectors'
import * as walletActions from 'store/ducks/wallet/actions'
import * as walletSelector from 'store/ducks/wallet/selectors'
import HeaderRight from 'components/ProfileSelf/Header'
import { useEffectWhenFocused } from 'services/hooks'

const ProfileSelfService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user = useSelector(authSelector.authUser)
  const authUser = useSelector(authSelector.authUserSelector)
  const walletTotal = useSelector(walletSelector.walletTotal)
  const username = path(['username'])(authUser)

  const walletGetRequest = () => dispatch(walletActions.walletGetRequest())

  const profileRef = useRef(null)
  useScrollToTop(profileRef)

  useEffect(() => {
    dispatch(authActions.authGetUserRequest())
    walletGetRequest()
  }, [])

  useEffect(() => {
    const headerRight = () => <HeaderRight walletTotal={walletTotal} />

    navigation.setOptions({ headerRight })
  }, [walletTotal])

  useEffectWhenFocused(() => {
    if (username) {
      navigation.setOptions({ title: username })
    }
  }, [username])

  return children({
    user,
    profileRef,
    usersGetProfile: authUser,
    walletGetRequest,
  })
}

export default ProfileSelfService
