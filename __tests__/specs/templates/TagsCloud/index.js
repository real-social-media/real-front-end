import React from 'react'
import { render, within, fireEvent } from 'tests/utils'
import TagsCloud, { a11y } from 'templates/TagsCloud'

/**
 * Mock Data
 */
const options = ['a', 'b', 'd']

const setup = (props = {}) => render(<TagsCloud {...props} />)

describe('TagsCloud', () => {
  it('empty by default', () => {
    const { queryAllByAccessibilityLabel } = setup()

    expect(queryAllByAccessibilityLabel(a11y.option)).toHaveLength(0)
  })

  it('render tags', () => {
    const { queryAllByAccessibilityLabel } = setup({ options })

    const $tags = queryAllByAccessibilityLabel(a11y.option)

    expect($tags).toHaveLength(options.length)

    $tags.forEach(($item, index) => {
      expect(within($item).queryByText(`#${options[index]}`)).toBeTruthy()
    })
  })

  it('onPress callback', () => {
    const onPress = jest.fn()
    const { queryAllByAccessibilityLabel } = setup({ options, onPress })

    queryAllByAccessibilityLabel(a11y.deleteBtn).forEach(($item, index) => {
      fireEvent.press($item)
      expect(onPress).toHaveBeenCalledWith(options[index])
      onPress.mockClear()
    })
  })
})
