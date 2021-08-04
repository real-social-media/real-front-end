import React from 'react'
import { RESULTS } from 'react-native-permissions'
import { renderWithProviders, fireEvent, within } from 'tests/utils'
import PostType, { a11y } from 'components/PostType'
import testIDs from 'components/PostType/test-ids'

const setup = (props) => renderWithProviders(<PostType {...props} />)

describe('PostType component', () => {
  it('close popup on outside tab', () => {
    const handleClose = jest.fn()
    const { getByTestId } = setup({ handleClose })

    expect(handleClose).not.toHaveBeenCalled()

    fireEvent.press(getByTestId(testIDs.backdrop))
    expect(handleClose).toHaveBeenCalled()
  })

  it('close popup on close button tab', () => {
    const handleClose = jest.fn()
    const { getByText } = setup({ handleClose })

    expect(handleClose).not.toHaveBeenCalled()

    fireEvent.press(getByText('Close'))
    expect(handleClose).toHaveBeenCalled()
  })

  it('photo post button', () => {
    const handlePhotoTab = jest.fn()
    const { getByText } = setup({ handlePhotoTab })

    expect(handlePhotoTab).not.toHaveBeenCalled()

    fireEvent.press(getByText('Photo'))
    expect(handlePhotoTab).toHaveBeenCalled()
  })

  it('post from gallery button', () => {
    const handleLibrarySnap = jest.fn()
    const { getByText } = setup({ handleLibrarySnap })

    expect(handleLibrarySnap).not.toHaveBeenCalled()

    fireEvent.press(getByText('Gallery'))
    expect(handleLibrarySnap).toHaveBeenCalled()
  })

  it('text post button', () => {
    const handleTextPostTab = jest.fn()
    const { getByText } = setup({ handleTextPostTab })

    expect(handleTextPostTab).not.toHaveBeenCalled()

    fireEvent.press(getByText('Text'))
    expect(handleTextPostTab).toHaveBeenCalled()
  })

  it('not display permission manage by default', () => {
    const { queryByAccessibilityLabel } = setup()

    expect(queryByAccessibilityLabel(a11y.permission)).toBeFalsy()
  })

  it('display manage permission when permission limited', () => {
    const handleManageAccess = jest.fn()
    const { queryByAccessibilityLabel } = setup({ handleManageAccess, permission: RESULTS.LIMITED })
    const $permission = queryByAccessibilityLabel(a11y.permission)

    expect($permission).toBeTruthy()
    expect(
      within($permission).getByText('You’ve given REAL access to only a select number of photos. Manage'),
    ).toBeTruthy()

    fireEvent.press($permission)
    expect(handleManageAccess).toHaveBeenCalled()
  })
})
