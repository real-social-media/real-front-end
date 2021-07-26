import React from 'react'
import PostCreateForm, { a11y } from 'components/PostCreate/Form'
import { useNavigation } from '@react-navigation/native'
import { renderWithProviders, fireEvent } from 'tests/utils'
import { testField } from 'tests/utils/helpers'
import * as Validation from 'services/Validation'
import FormKeywords from 'components/PostCreate/FormKeywords'

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
jest.mock('components/PostCreate/FormKeywords', () => jest.fn().mockReturnValue(null))

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)

/**
 * Mock Functions
 */
const handleSubmit = jest.fn()
const formLifetime = () => null
const formAlbums = () => null

/**
 * Mock Data
 */
const user = {
  likesDisabled: false,
  commentsDisabled: false,
  sharingDisabled: false,
  verificationHidden: false,
}

const cameraCapture = {
  text: 'text',
  preview: 'preview',
  uri: 'uri',
  takenInReal: 'takenInReal',
  imageFormat: 'imageFormat',
  originalFormat: 'originalFormat',
  originalMetadata: 'originalMetadata',
  crop: 'crop',
}

const values = {
  commentsDisabled: false,
  crop: 'crop',
  imageFormat: 'imageFormat',
  images: ['uri'],
  keywords: [],
  lifetime: null,
  likesDisabled: false,
  originalFormat: 'originalFormat',
  originalMetadata: 'originalMetadata',
  payment: undefined,
  postType: undefined,
  preview: ['preview'],
  sharingDisabled: false,
  takenInReal: 'takenInReal',
  text: 'text',
  verificationHidden: false,
}

const requiredProps = { handleSubmit, user, cameraCapture, formLifetime, formAlbums }

const setup = () => renderWithProviders(<PostCreateForm {...requiredProps} />)

describe('PostCreate Form', () => {
  afterEach(() => {
    FormKeywords.mockClear()
  })

  it('payment field', () => {
    const { getByLabelText, queryByAccessibilityLabel } = setup()

    fireEvent.press(queryByAccessibilityLabel(a11y.payment))

    testField(getByLabelText('payment'), {
      name: 'payment',
      value: undefined,
      ...Validation.getInputTypeProps('payment'),
    })
  })

  it('toggle keywords form', () => {
    const { queryByAccessibilityLabel } = setup()

    expect(FormKeywords).not.toHaveBeenCalled()

    fireEvent.press(queryByAccessibilityLabel(a11y.keywords))
    expect(FormKeywords).toHaveBeenCalled()

    const props = FormKeywords.mock.calls[0][0]
    expect(props.values).toEqual(values)
    expect(typeof props.setFieldValue).toBe('function')
  })
})
