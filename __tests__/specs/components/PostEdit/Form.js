import React from 'react'
import PostEditForm, { a11y } from 'components/PostEdit/Form'
import { useNavigation } from '@react-navigation/native'
import { renderWithProviders, fireEvent } from 'tests/utils'
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
const postsEdit = {
  status: 'success',
}

const postsSingleGet = {
  data: {
    payment: 1.1,
    text: 'text',
    preview: 'preview',
    uri: 'uri',
    takenInReal: 'takenInReal',
    imageFormat: 'imageFormat',
    originalFormat: 'originalFormat',
    originalMetadata: 'originalMetadata',
    crop: 'crop',
    keywords: [],
  },
}

const values = {
  albumId: undefined,
  commentsDisabled: undefined,
  keywords: [],
  lifetime: null,
  likesDisabled: undefined,
  payment: '1.1',
  paymentSlider: 'custom',
  paymentTicker: undefined,
  postId: undefined,
  postType: undefined,
  sharingDisabled: undefined,
  text: 'text',
  uri: undefined,
}

const requiredProps = { handleSubmit, postsSingleGet, postsEdit, formLifetime, formAlbums }

const setup = () => renderWithProviders(<PostEditForm {...requiredProps} />)

describe('PostEdit Form', () => {
  afterEach(() => {
    FormKeywords.mockClear()
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
