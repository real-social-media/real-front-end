import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { check, openSettings, RESULTS } from 'react-native-permissions'
import { renderWithProviders, fireEvent, sleep, act } from 'tests/utils'
import { a11y } from 'components/PostType'
import PostTypeScreen from 'screens/PostTypeScreen'
import { VERIFICATION_TYPE } from 'components/Verification'
import useLibrary from 'services/providers/Camera/useLibrary'
import * as cameraActions from 'store/ducks/camera/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import testIDs from 'components/PostType/test-ids'
import * as authSelector from 'store/ducks/auth/selectors'
import { AuthProvider } from 'services/providers/Auth'
import { testNavigate } from 'tests/utils/helpers'

jest.spyOn(authSelector, 'authUser').mockReturnValue({ userStatus: 'ACTIVE' })
jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (cb) => cb() }))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
jest.mock('services/providers/Camera/useLibrary')

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const navigation = { popToTop: jest.fn(), navigate: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () =>
  renderWithProviders(
    <AuthProvider>
      <PostTypeScreen />
    </AuthProvider>,
  )

describe('PostType screen', () => {
  beforeEach(() => {
    useLibrary.mockReset()
    dispatch.mockClear()
    navigation.navigate.mockClear()
    navigation.popToTop.mockClear()
    openSettings.mockClear()
  })

  it('redirect to camera screen on Photo button tab', async () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Photo'))
    expect(navigation.popToTop).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalledWith('Camera', { multiple: true })
    await act(sleep)
  })

  it('Redirect anonymous user', async () => {
    authSelector.authUser.mockReturnValueOnce({ userStatus: 'ANONYMOUS' })

    const { getByText } = setup()

    fireEvent.press(getByText('Photo'))
    testNavigate(navigation, 'App.Root.ProfileUpgrade')
    await act(sleep)
  })

  it('redirect to text post create form on Text button tab', async () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Text'))
    expect(navigation.popToTop).toHaveBeenCalled()
    testNavigate(navigation, 'PostCreate', { type: 'TEXT_ONLY' })
    await act(sleep)
  })

  it('redirect to verification screen only first time when user create a post from gallery', async () => {
    const handleLibrarySnap = jest.fn()

    AsyncStorage.getItem.mockResolvedValueOnce(undefined)

    useLibrary.mockReturnValueOnce({ handleLibrarySnap })

    const { getByText } = setup()

    fireEvent.press(getByText('Gallery'))

    await act(sleep)

    expect(navigation.popToTop).toHaveBeenCalled()
    expect(navigation.navigate).toHaveBeenCalled()

    const calledWith = navigation.navigate.mock.calls[0]
    const { handleNext, actionType } = calledWith[1]

    expect(calledWith[0]).toBe('Verification')
    expect(actionType).toBe(VERIFICATION_TYPE.CONTINUE)

    handleNext()
    expect(handleLibrarySnap).toHaveBeenCalledWith()
  })

  it('redirect directly to create post from gallery screen', async () => {
    const handleLibrarySnap = jest.fn()

    AsyncStorage.getItem.mockResolvedValueOnce('skip')

    useLibrary.mockReturnValueOnce({ handleLibrarySnap })

    const { getByText } = setup()

    fireEvent.press(getByText('Gallery'))

    await act(sleep)

    expect(navigation.popToTop).toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(handleLibrarySnap).toHaveBeenCalledWith()
  })

  it('should close popup on close button tap', async () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Close'))
    expect(navigation.popToTop).toHaveBeenCalled()
    await act(sleep)
  })

  it('should close popup on outside click', async () => {
    const { getByTestId } = setup()

    fireEvent.press(getByTestId(testIDs.backdrop))
    expect(navigation.popToTop).toHaveBeenCalled()
    await act(sleep)
  })

  it('should provide handleProcessedPhoto for useLibrary hook', async () => {
    setup()

    expect(useLibrary).toHaveBeenCalled()

    const { handleProcessedMedia } = useLibrary.mock.calls[0][0]
    const payload = [{ preview: 'preview' }]

    handleProcessedMedia(payload)
    expect(dispatch).toHaveBeenCalledWith(cameraActions.cameraCaptureRequest(payload))
    testNavigate(navigation, 'PostCreate', { type: 'IMAGE' })
    await act(sleep)
  })

  it('not display permission manage by default', async () => {
    const { queryByAccessibilityLabel } = setup()

    expect(queryByAccessibilityLabel(a11y.permission)).toBeFalsy()
    await act(sleep)
  })

  it('display manage permission when permission limited', async () => {
    check.mockResolvedValueOnce(RESULTS.LIMITED)
    const { queryByAccessibilityLabel } = setup()

    await act(sleep)

    fireEvent.press(queryByAccessibilityLabel(a11y.permission))
    expect(openSettings).toHaveBeenCalled()
  })
})
