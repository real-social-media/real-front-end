import React from 'react'
import { renderWithProviders } from 'tests/utils'
import TextInput, { styles } from 'components/TextInput'
import * as RNPaper from 'react-native-paper'

const setup = (props = {}) => renderWithProviders(<TextInput {...props} />)

const mockInput = () => jest.spyOn(RNPaper.TextInput, 'render').mockImplementation(() => null)
const getFirstCallArgs = (fn) => fn.mock.calls[0][0]

describe('TextInput', () => {
  it('default styles', () => {
    const mockedInput = mockInput()

    setup()

    expect(getFirstCallArgs(mockedInput).style).toEqual([null, styles.input])
    mockedInput.mockRestore()
  })

  it('custom styles', () => {
    const mockedInput = mockInput()
    const style = { height: 100, width: 300 }

    setup({ style })

    expect(getFirstCallArgs(mockedInput).style).toEqual([style, styles.input])
    mockedInput.mockRestore()
  })
})
