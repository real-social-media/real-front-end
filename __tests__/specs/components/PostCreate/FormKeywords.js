import React from 'react'
import { renderWithProviders, act, fireEvent, within } from 'tests/utils'
import FormKeywords, { a11y } from 'components/PostCreate/FormKeywords'
import * as keywordsAPI from 'store/ducks/keywords/api'
import * as TagsList from 'templates/TagsList'

jest.useFakeTimers()

/**
 * Mock Functions
 */
const keywords = ['a', 'b']
jest.spyOn(keywordsAPI, 'searchKeywords')
keywordsAPI.searchKeywords.mockResolvedValue(keywords)

const setFieldValue = jest.fn()

/**
 * Mock Data
 */
const query = 'query'
const values = { keywords: [], text: '' }
const requiredProps = { setFieldValue, values }

const setup = (props = {}) => renderWithProviders(<FormKeywords {...requiredProps} {...props} />)

describe('FormKeywords', () => {
  afterEach(() => {
    setFieldValue.mockClear()
    keywordsAPI.searchKeywords.mockClear()
  })

  it('modal hidden by default', () => {
    const { queryByAccessibilityLabel } = setup()

    expect(queryByAccessibilityLabel(a11y.modal)).toHaveProp('visible', false)
  })

  it('modal appearance', () => {
    const { queryByAccessibilityLabel } = setup()
    const $modal = queryByAccessibilityLabel(a11y.modal)

    expect($modal).toHaveProp('presentationStyle', 'formSheet')
    expect($modal).toHaveProp('animationType', 'slide')
  })

  it('open modal button', () => {
    const { queryByAccessibilityLabel } = setup()
    const $inputBtn = queryByAccessibilityLabel(a11y.inputBtn)

    expect($inputBtn).toBeTruthy()
    expect($inputBtn).toHaveProp('pointerEvents', 'none')
    expect($inputBtn).toHaveProp('placeholder', 'Type keywords')
  })

  it('toggle modal', async () => {
    const { queryByAccessibilityLabel } = setup()

    expect(queryByAccessibilityLabel(a11y.modal)).toHaveProp('visible', false)

    await act(async () => fireEvent.press(queryByAccessibilityLabel(a11y.openBtn)))
    expect(queryByAccessibilityLabel(a11y.modal)).toHaveProp('visible', true)
    expect(within(queryByAccessibilityLabel(a11y.closeBtn)).queryByText('Close')).toBeTruthy()

    await act(async () => fireEvent.press(queryByAccessibilityLabel(a11y.closeBtn)))
    expect(queryByAccessibilityLabel(a11y.modal)).toHaveProp('visible', false)
  })

  it('close modal and submit value on done button press', async () => {
    const { queryByAccessibilityLabel } = setup()
    const $input = queryByAccessibilityLabel(a11y.autocomplete.input)

    await act(async () => fireEvent.press(queryByAccessibilityLabel(a11y.openBtn)))

    await act(async () => fireEvent.changeText($input, query))
    await act(async () => jest.runAllTimers())

    await act(async () => fireEvent.press(queryByAccessibilityLabel(a11y.doneBtn)))

    expect(setFieldValue).toHaveBeenCalledWith('keywords', [query])
    expect(queryByAccessibilityLabel(a11y.modal)).toHaveProp('visible', false)
  })

  describe('autocomplete', () => {
    it('input appearance', () => {
      const { queryByAccessibilityLabel } = setup()
      const $input = queryByAccessibilityLabel(a11y.autocomplete.input)

      expect($input).toBeTruthy()
      expect($input).toHaveProp('placeholder', 'Type keywords')
      expect($input).toHaveProp('clearButtonMode', 'while-editing')
      expect($input).toHaveProp('blurOnSubmit', false)
      expect($input).toHaveProp('autoCorrect', false)
      expect($input).toHaveProp('enablesReturnKeyAutomatically', true)
      expect($input).toHaveProp('autoFocus', true)
    })

    it('empty by default', () => {
      const { queryByAccessibilityLabel, queryAllByAccessibilityLabel } = setup()
      const $input = queryByAccessibilityLabel(a11y.autocomplete.input)

      expect($input).toHaveProp('value', '')
      expect(queryAllByAccessibilityLabel(TagsList.a11y.option)).toHaveLength(0)
    })

    it('render suggestions', async () => {
      const { queryByAccessibilityLabel, queryAllByAccessibilityLabel } = setup()
      const $input = queryByAccessibilityLabel(a11y.autocomplete.input)

      await act(async () => fireEvent.changeText($input, query))
      await act(async () => jest.runAllTimers())

      expect(keywordsAPI.searchKeywords).toHaveBeenCalledWith(query)
      expect(queryAllByAccessibilityLabel(TagsList.a11y.option)).toHaveLength(keywords.length)
    })

    it('toggle suggestions', async () => {
      const props = { values: { keywords: ['a'], text: '' } }
      const { queryByAccessibilityLabel, queryAllByAccessibilityLabel } = setup(props)
      const $input = queryByAccessibilityLabel(a11y.autocomplete.input)

      await act(async () => fireEvent.changeText($input, query))
      await act(async () => jest.runAllTimers())

      const $suggestions = queryAllByAccessibilityLabel(TagsList.a11y.option)

      await act(async () => fireEvent.press($suggestions[0]))
      expect(setFieldValue).toHaveBeenCalledWith('keywords', [])

      await act(async () => fireEvent.press($suggestions[1]))
      expect(setFieldValue).toHaveBeenCalledWith('keywords', ['a', 'b'])
    })

    it('clear input and trim value on onSubmitEditing', async () => {
      const queryWithSpaces = ` ${query} `
      const { queryByAccessibilityLabel } = setup()
      const $input = queryByAccessibilityLabel(a11y.autocomplete.input)

      await act(async () => fireEvent.changeText($input, queryWithSpaces))
      await act(async () => fireEvent($input, 'onSubmitEditing', { nativeEvent: { text: queryWithSpaces } }))

      expect($input).toHaveProp('value', '')
      expect(setFieldValue).toHaveBeenCalledWith('keywords', [query])
    })
  })
})
