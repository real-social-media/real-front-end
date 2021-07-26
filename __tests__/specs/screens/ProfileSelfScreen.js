import React from 'react'
import ProfileSelfScreen from 'screens/ProfileSelfScreen'
import { renderWithStore } from 'tests/utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as albumsActions from 'store/ducks/albums/actions'
import * as postsActions from 'store/ducks/posts/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as authActions from 'store/ducks/auth/actions'
import * as walletActions from 'store/ducks/wallet/actions'

const user = {
  userId: 'id123',
  username: 'username',
}

jest.spyOn(authSelector, 'authUserSelector').mockReturnValue({ data: user })
jest.spyOn(authSelector, 'authUser').mockReturnValue(user)
jest.spyOn(authSelector, 'authUserId').mockReturnValue(user.userId)
jest.spyOn(ReactRedux, 'useDispatch')

const dispatch = jest.fn()
ReactRedux.useDispatch.mockReturnValue(dispatch)

jest.mock('components/Cache', () => jest.fn().mockReturnValue(null))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useScrollToTop: jest.fn(),
  useRoute: jest.fn(),
  useIsFocused: jest.fn().mockReturnValue(true),
}))

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<ProfileSelfScreen />)

describe('ProfileSelfScreen', () => {
  describe('initial loading', () => {
    afterEach(() => {
      dispatch.mockClear()
      authSelector.authUserSelector.mockReturnValue(user)
      useRoute.mockReturnValue({ params: {} })
      navigation.setOptions.mockClear()
    })

    it('request data for authorized user', () => {
      setup()

      expect(dispatch).toHaveBeenCalledWith(authActions.authGetUserRequest())
      expect(dispatch).toHaveBeenCalledWith(albumsActions.albumsGetRequest({ userId: 'id123' }))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetRequest({ userId: 'id123' }))
    })

    it('fetch wallet', () => {
      setup()

      expect(dispatch).toHaveBeenCalledWith(walletActions.walletGetRequest())
    })

    it('request data for user from route params', () => {
      const params = { userId: '23' }
      useRoute.mockReturnValue({ params })
      setup()

      expect(dispatch).toHaveBeenCalledWith(authActions.authGetUserRequest())
      expect(dispatch).toHaveBeenCalledWith(albumsActions.albumsGetRequest(params))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetRequest(params))
    })

    it('not load albums and posts for not authorized user', () => {
      authSelector.authUserSelector.mockReturnValue({})
      authSelector.authUserId.mockReturnValue(false)

      setup()

      expect(dispatch).toHaveBeenCalledWith(authActions.authGetUserRequest())
    })

    it('set username as screen title', () => {
      setup()

      expect(navigation.setOptions).toHaveBeenCalledWith({ title: user.username })
    })
  })
})
