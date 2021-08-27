import React from 'react'
import Slider, { a11y } from 'components/Slider'
import { renderWithProviders, fireEvent, within } from 'tests/utils'

/**
 * Mock Data
 */
const options = [
  { label: 'label1', value: 'value1' },
  { label: 'label2', value: 'value2' },
  { label: 'label3', value: 'value3' },
]
const requiredProps = { onChange: () => {} }
const setup = (props = {}) => renderWithProviders(<Slider {...requiredProps} {...props} />)

describe('Slider', () => {
  it('default settings', () => {
    const { getByAccessibilityLabel } = setup()
    const $slider = getByAccessibilityLabel(a11y.slider)

    expect($slider).toBeTruthy()
    expect($slider).toHaveProp('step', 1)
    expect($slider).toHaveProp('minimumValue', 0)
    expect($slider).toHaveProp('maximumValue', -1)
    expect($slider).toHaveProp('value', -1)
    expect($slider).toHaveProp('maximumTrackTintColor', '#363636')
    expect($slider).toHaveProp('minimumTrackTintColor', '#21ce99')
  })

  it('empty options', () => {
    const { queryAllByAccessibilityLabel } = setup()

    expect(queryAllByAccessibilityLabel(a11y.option)).toHaveLength(0)
  })

  it('with options', () => {
    const { queryAllByAccessibilityLabel, getByAccessibilityLabel } = setup({ options })

    const $slider = getByAccessibilityLabel(a11y.slider)
    expect($slider).toHaveProp('maximumValue', options.length - 1)

    const $options = queryAllByAccessibilityLabel(a11y.option)
    expect($options).toHaveLength(options.length)

    $options.forEach(($item, index) => {
      expect(within($item).queryByText(options[index].label)).toBeTruthy()
    })
  })

  it('slider with value', () => {
    const index = 1
    const value = options[index].value
    const { getByAccessibilityLabel } = setup({ options, value })
    const $slider = getByAccessibilityLabel(a11y.slider)

    expect($slider).toHaveProp('value', index)
  })

  it('align first and last option', () => {
    const { queryAllByAccessibilityLabel } = setup({ options })
    const $options = queryAllByAccessibilityLabel(a11y.option)
    const styles = { opacity: 1, position: 'relative', width: 0 }

    expect($options[0]).toHaveProp('style', {
      alignItems: 'flex-start',
      left: -14,
      ...styles,
    })

    expect($options[options.length - 1]).toHaveProp('style', {
      alignItems: 'flex-end',
      right: -14,
      ...styles,
    })
  })

  it('onChange', () => {
    const onChange = jest.fn()
    const { queryAllByAccessibilityLabel } = setup({ onChange, options })
    const $options = queryAllByAccessibilityLabel(a11y.option)

    $options.forEach(($item, index) => {
      fireEvent.press($item)

      expect(onChange).toHaveBeenCalledWith(options[index].value)
      onChange.mockClear()
    })
  })
})
