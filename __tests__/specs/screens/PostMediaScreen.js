import React from 'react'
import PostMediaScreen from 'screens/PostMediaScreen'
import { renderWithStore } from 'tests/utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as postsSelector from 'store/ducks/posts/selectors'
import PostComponent from 'components/Post'

jest.mock('components/Post', () => jest.fn().mockReturnValue(null))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useScrollToTop: jest.fn(),
  useRoute: jest.fn(),
  useIsFocused: jest.fn().mockReturnValue(true),
}))

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)

const params = { postId: 1, userId: '2' }
useRoute.mockReturnValue({ params })

const setup = () => renderWithStore(<PostMediaScreen />)

describe('PostMediaScreen', () => {
  afterEach(() => {
    navigation.setOptions.mockClear()
    PostComponent.mockClear()
  })

  describe('Initialize', () => {
    it('fetch single post on mount', () => {
      const dispatch = jest.fn()
      jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch)

      setup()

      expect(dispatch).toHaveBeenCalledWith({
        type: 'POSTS_SINGLE_GET_REQUEST',
        payload: { postId: 1, userId: '2' },
      })

      ReactRedux.useDispatch.mockRestore()
    })

    it('is not fetching single post with invalid params', () => {
      useRoute.mockReturnValueOnce({ params: {} })
      const dispatch = jest.fn()
      jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch)

      setup()

      expect(dispatch).not.toHaveBeenCalled()

      ReactRedux.useDispatch.mockRestore()
    })
  })

  describe('Loading state', () => {
    it('not render a post in empty state', () => {
      setup()

      expect(PostComponent).not.toHaveBeenCalled()
    })
  })

  describe('Success state', () => {
    const data = { postId: '1', postedBy: { userId: 2, username: 'username' } }

    beforeAll(() => {
      jest
        .spyOn(postsSelector, 'postsSingleGetSelector')
        .mockReturnValue(() => ({ data, status: 'success',  payload: params, meta: {} }))
    })

    afterAll(() => {
      postsSelector.postsSingleGetSelector.mockRestore()
    })

    it('render post', () => {
      setup()

      expect(PostComponent).toHaveBeenCalled()
    })

    it('set username as a screen title', async () => {
      setup()

      expect(navigation.setOptions).toHaveBeenCalledWith({ title: 'username' })
    })
  })
})
