import React from 'react'
import { render, within, fireEvent } from 'tests/utils'
import TagsList, { a11y } from 'templates/TagsList'

/**
 * Mock Data
 */
const options = ['a', 'b', 'd']
const value = [options[0], options[1]]

const setup = (props = {}) => render(<TagsList {...props} />)

describe('TagsList', () => {
  it('empty by default', () => {
    const { queryAllByAccessibilityLabel } = setup()

    expect(queryAllByAccessibilityLabel(a11y.option)).toHaveLength(0)
  })

  it('render options', () => {
    const { queryAllByAccessibilityLabel } = setup({ options })
    const $options = queryAllByAccessibilityLabel(a11y.option)

    expect($options).toHaveLength(options.length)

    $options.forEach(($item, index) => {
      expect(within($item).queryByText(`#${options[index]}`)).toBeTruthy()
    })
  })

  it('mark selected options', () => {
    const { queryAllByAccessibilityLabel } = setup({ options, value })

    expect(value.length).toBeLessThan(options.length)

    queryAllByAccessibilityLabel(a11y.option).forEach(($item, index) => {
      const isSelected = value.indexOf(options[index]) !== -1
      const $addIcon = within($item).queryByAccessibilityLabel(a11y.addIcon)
      const $removeIcon = within($item).queryByAccessibilityLabel(a11y.removeIcon)

      if (isSelected) {
        expect($addIcon).toBeFalsy()
        expect($removeIcon).toBeTruthy()
      } else {
        expect($addIcon).toBeTruthy()
        expect($removeIcon).toBeFalsy()
      }
    })
  })

  it('onPress callback', () => {
    const onPress = jest.fn()
    const { queryAllByAccessibilityLabel } = setup({ options, onPress, value })

    queryAllByAccessibilityLabel(a11y.option).forEach(($item, index) => {
      const isSelected = value.indexOf(options[index]) !== -1

      fireEvent.press($item)
      expect(onPress).toHaveBeenCalledWith(options[index], { isSelected })
      onPress.mockClear()
    })
  })
})
