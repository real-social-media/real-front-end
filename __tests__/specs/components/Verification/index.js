import React from 'react'
import { renderWithProviders, fireEvent, act } from 'tests/utils'
import Verification, { VERIFICATION_TYPE, a11y } from 'components/Verification'

const setup = (props) => renderWithProviders(<Verification {...props} />)

describe('Verification Screen', () => {
  it('should represent a header', () => {
    const { getByText } = setup()

    getByText('Trending Tips')
    getByText('You’re perfect! Verify future posts to get them trending faster!')
  })

  it('should represent verification rules', () => {
    const { getByText } = setup()

    getByText('In-app Camera')
    getByText('Photos/Videos taken inside this app are always authenticated & boosted towards the top of trending')

    getByText('Cropping/Rotating')
    getByText('Be sure to crop/rotate images within this app to ensure they pass verification.')
    getByText('Our app can’t tell what was changed about a photo, it only knows if it was modified by another app.')

    getByText('Copyright Origin Check')
    getByText('The Photo must have been taken using this device to pass verification')

    getByText('Device must be an iPhone7 or newer')
    getByText('Photo must have been taken using the iOS camera app')

    getByText('You’re perfect the way you are.')
    getByText('On REAL, you’re more likely to go viral by being yourself!')
  })

  describe('actionType: BACK', () => {
    const actionType = VERIFICATION_TYPE.BACK
    const handleBackAction = jest.fn()
    const props = { actionType, handleBackAction }

    beforeEach(() => handleBackAction.mockReset())

    it('should render only Go Back button', () => {
      const { getByText, queryAllByRole } = setup(props)

      expect(getByText('Go Back')).toBeTruthy()
      expect(queryAllByRole('button')).toHaveLength(1)
    })

    it('the button should have callback on tap', () => {
      const { getByText } = setup(props)

      expect(handleBackAction).not.toHaveBeenCalled()

      fireEvent.press(getByText('Go Back'))
      expect(handleBackAction).toHaveBeenCalled()
    })
  })

  describe('actionType: HIDE', () => {
    const actionType = VERIFICATION_TYPE.HIDE
    const handleBackAction = jest.fn()
    const handleHideAction = jest.fn()
    const props = { actionType, handleBackAction, handleHideAction }

    beforeEach(() => {
      handleBackAction.mockReset()
      handleHideAction.mockReset()
    })

    it('should render action buttons', () => {
      const { getByText, queryAllByRole } = setup(props)

      expect(getByText('Go Back')).toBeTruthy()
      expect(getByText('Hide and Proceed')).toBeTruthy()
      expect(queryAllByRole('button')).toHaveLength(2)
    })

    it('Go Back button should have callback on tap', () => {
      const { getByText } = setup(props)

      expect(handleBackAction).not.toHaveBeenCalled()

      fireEvent.press(getByText('Go Back'))
      expect(handleBackAction).toHaveBeenCalled()
    })

    it('Hide and Proceed button should have callback on tap', () => {
      const { getByText } = setup(props)

      expect(handleHideAction).not.toHaveBeenCalled()

      fireEvent.press(getByText('Hide and Proceed'))
      expect(handleHideAction).toHaveBeenCalled()
    })
  })

  describe('actionType: HOME', () => {
    const actionType = VERIFICATION_TYPE.HOME
    const handleBackAction = jest.fn()
    const props = { actionType, handleBackAction }

    beforeEach(() => handleBackAction.mockReset())

    it('should render only hide button', () => {
      const { getByText, queryAllByRole } = setup(props)

      expect(getByText('Hide and Proceed')).toBeTruthy()
      expect(queryAllByRole('button')).toHaveLength(1)
    })

    it('Hide and Proceed button should have callback on tap', () => {
      const { getByText } = setup(props)

      expect(handleBackAction).not.toHaveBeenCalled()

      fireEvent.press(getByText('Hide and Proceed'))
      expect(handleBackAction).toHaveBeenCalled()
    })
  })

  describe('actionType: CONTINUE', () => {
    const actionType = VERIFICATION_TYPE.CONTINUE
    const handleContinueAction = jest.fn()
    const props = { actionType, handleContinueAction }

    beforeEach(() => handleContinueAction.mockReset())

    it('should render only continue button', () => {
      const { getByText, queryAllByRole } = setup(props)

      expect(getByText('Continue')).toBeTruthy()
      expect(queryAllByRole('button')).toHaveLength(1)
    })

    it('Continue button should have callback on tap', () => {
      const { getByText } = setup(props)

      expect(handleContinueAction).not.toHaveBeenCalled()

      fireEvent.press(getByText('Continue'))
      expect(handleContinueAction).toHaveBeenCalled()
    })
  })

  describe('toggle ELA image', () => {
    it('ELA block hidden by default', () => {
      const { queryByAccessibilityLabel } = setup()

      expect(queryByAccessibilityLabel(a11y.openELABtn)).toBeFalsy()
      expect(queryByAccessibilityLabel(a11y.ELAImage)).toBeFalsy()
    })

    it('toggle ELA image', async () => {
      const urlEla = 'urlEla.jpg'
      const { queryByAccessibilityLabel } = setup({ urlEla })
      const $openELABtn = queryByAccessibilityLabel(a11y.openELABtn)
      const $image = queryByAccessibilityLabel(a11y.ELAImage)
      const $modal = queryByAccessibilityLabel(a11y.ELAModal)

      expect($openELABtn).toBeTruthy()
      expect($image).toBeTruthy()
      expect($image).toHaveProp('source', { uri: urlEla })
      expect($modal).toHaveProp('visible', false)

      await act(async () => fireEvent.press($openELABtn))
      expect($modal).toHaveProp('visible', true)

      await act(async () => fireEvent.press(queryByAccessibilityLabel(a11y.closeELABtn)))
      expect($modal).toHaveProp('visible', false)
    })
  })
})
