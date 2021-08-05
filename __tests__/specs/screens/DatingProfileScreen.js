import React from 'react'
import DatingProfileScreen from 'screens/DatingProfileScreen'
import { renderWithStore, act, fireEvent } from 'tests/utils'
import { testNavigate } from 'tests/utils/helpers'
import { useNavigation } from '@react-navigation/native'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as authActions from 'store/ducks/auth/actions'
import * as usersSelector from 'store/ducks/users/selectors'
import * as ReactRedux from 'react-redux'
import DatingCard from 'components/Dating/Card'

const user = {
  userId: 'id123',
  gender: 'FEMALE',
  displayName: 'displayName',
  dateOfBirth: '1990-04-21',
  height: 170,
  bio: 'bio',
  userStatus: 'ACTIVE',
}

jest.spyOn(authSelector, 'authUser').mockReturnValue(user)
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn().mockReturnValue(true),
}))
jest.mock('components/Dating/Card', () => jest.fn().mockReturnValue(null))

const navigation = { navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<DatingProfileScreen />)

describe('DatingProfileScreen', () => {
  describe('Initialization', () => {
    const dispatch = jest.fn()

    afterEach(() => {
      dispatch.mockClear()
    })

    beforeAll(() => {
      jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch)
    })

    afterAll(() => {
      ReactRedux.useDispatch.mockRestore()
    })

    it('request data for authorized user', () => {
      setup()

      expect(dispatch).toHaveBeenCalledWith(authActions.authGetUserRequest())
      expect(dispatch).toHaveBeenCalledWith(
        usersActions.usersImagePostsGetRequest({ userId: user.userId, isVerified: true }),
      )
    })

    it('start dating button', async () => {
      const { queryByText } = setup()

      expect(queryByText('Open Dating')).toBeFalsy()

      await act(async () => {
        fireEvent.press(queryByText('Start Dating'))
      })

      expect(dispatch).toHaveBeenCalledWith(usersActions.usersSetUserDatingStatusRequest({ status: 'ENABLED' }))
    })

    it('open dating button', async () => {
      authSelector.authUser.mockReturnValue({ ...user, datingStatus: 'ENABLED' })
      const { queryByText } = setup()

      expect(queryByText('Start Dating')).toBeFalsy()

      await act(async () => {
        fireEvent.press(queryByText('Open Dating'))
      })

      testNavigate(navigation, 'Dating.Dating')
      authSelector.authUser.mockReturnValue(user)
    })
  })

  describe('Submitting state', () => {
    it('submit button note', () => {
      const { getByText } = setup()

      expect(getByText('Preview your dating profile and start dating')).toBeTruthy()
    })

    it('disable submit button', async () => {
      const { store, getByAccessibilityLabel } = setup()

      expect(getByAccessibilityLabel('Submit')).toBeEnabled()

      await act(async () => {
        store.dispatch(usersActions.usersSetUserDatingStatusRequest())
      })

      expect(getByAccessibilityLabel('Submit')).toBeDisabled()
    })
  })

  describe('Success state', () => {
    afterEach(() => {
      navigation.navigate.mockClear()
      DatingCard.mockClear()
    })

    it('render dating card with posts', () => {
      DatingCard.mockClear()

      const posts = [{ a: 1 }, { b: 2 }]
      const usersImagePostsGetSelector = jest
        .spyOn(usersSelector, 'usersImagePostsGetSelector')
        .mockReturnValue({ data: posts })

      setup()

      expect(DatingCard).toHaveBeenCalled()
      expect(DatingCard.mock.calls[0][0]).toEqual({ user, posts })

      usersImagePostsGetSelector.mockRestore()
    })

    it('redirect to dating on success', async () => {
      authSelector.authUser.mockReturnValue({ ...user, datingStatus: 'ENABLED' })
      const { store } = setup()

      await act(async () => {
        store.dispatch(usersActions.usersSetUserDatingStatusSuccess({ data: {}, payload: {} }))
      })

      testNavigate(navigation, 'Dating.Dating')
      authSelector.authUser.mockReturnValue(user)
    })
  })
})
