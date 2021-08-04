import React from 'react'
import { Linking } from 'react-native'
import { renderWithProviders, fireEvent } from 'tests/utils'
import Header from 'components/ProfileSelf/Header'

/**
 * Mock Functions
 */
jest.spyOn(Linking, 'openURL')

const setup = (props = {}) => renderWithProviders(<Header {...props} />)

describe('ProfileSelf header component', () => {
  afterEach(() => {
    Linking.openURL.mockClear()
  })

  it('wallet amount by default', () => {
    const { getByText } = setup()

    expect(getByText('$0.00')).toBeTruthy()
  })

  it('wallet amount', () => {
    const { getByText } = setup({ walletTotal: '9.4' })

    expect(getByText('$9.40')).toBeTruthy()
  })

  it('wallet amount should be a link', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('$0.00'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://real.app/apps/coins')
  })
})
