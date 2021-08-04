import React from 'react'
import ProfileScreen from 'screens/ProfileScreen'
import { renderWithStore } from 'tests/utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as albumsActions from 'store/ducks/albums/actions'
import * as postsActions from 'store/ducks/posts/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as albumsSelector from 'store/ducks/albums/selectors'
import * as albumsReducer from 'store/ducks/albums/reducer'
import * as usersActions from 'store/ducks/users/actions'
import * as walletActions from 'store/ducks/wallet/actions'

const user = {
  userId: 'id123',
}

const params = {
  userId: 'id31234',
}

jest.spyOn(authSelector, 'authUser').mockReturnValue(user)
jest.spyOn(authSelector, 'authUserId').mockReturnValue(user.userId)

jest.spyOn(albumsSelector, 'albumsGetSelector')

jest.spyOn(ReactRedux, 'useDispatch')

const dispatch = jest.fn()
ReactRedux.useDispatch.mockReturnValue(dispatch)

albumsSelector.albumsGetSelector.mockImplementation(() =>
  jest.fn().mockReturnValue(albumsReducer.initialState.albumsGet),
)

jest.mock('components/Cache', () => jest.fn().mockReturnValue(null))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useScrollToTop: jest.fn(),
  useRoute: jest.fn(),
  useIsFocused: jest.fn().mockReturnValue(true),
}))

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)
useRoute.mockReturnValue({ params })

const setup = () => renderWithStore(<ProfileScreen />)

describe('ProfileScreen', () => {
  describe('initial loading', () => {
    afterEach(() => {
      dispatch.mockClear()
      useRoute.mockReturnValue({ params })
    })

    it('request data for user from route params', () => {
      setup()

      expect(dispatch).toHaveBeenCalledWith(albumsActions.albumsGetRequest(params))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetRequest(params))
      expect(dispatch).toHaveBeenCalledWith(usersActions.usersGetProfileRequest(params))
    })

    it('not fetch wallet for not owner', () => {
      setup()

      expect(dispatch).not.toHaveBeenCalledWith(walletActions.walletGetRequest())
    })

    it('not get profile for empty userId', () => {
      useRoute.mockReturnValue({ params: {} })
      setup()

      expect(dispatch).toHaveBeenCalledWith(albumsActions.albumsGetRequest(user))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetRequest(user))
      expect(dispatch).toHaveBeenCalledTimes(2)
    })
  })
})
