import React from 'react'
import { PostComponent } from 'components/Post'
import { a11y } from 'components/Post/Unlock'
import { renderWithStore, fireEvent } from 'tests/utils'
import * as postsActions from 'store/ducks/posts/actions'

/**
 * Mock Data
 */
const textPost = {
  postId: '123123',
  postType: 'TEXT_ONLY',
  viewedStatus: 'NOT_VIEWED',
  payment: 0.00001,
  postedBy: {
    userId: '12321',
  },
}

const requiredProps = { post: textPost }

/**
 * Mock Functions
 */
jest.mock('react-native-view-shot', () => jest.fn().mockReturnValue(null))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))
jest.mock('components/Cache', () => jest.fn().mockReturnValue(null))

const setup = (props = {}) => renderWithStore(<PostComponent {...requiredProps} {...props} />)

describe('PostComponent', () => {
  describe('unlock', () => {
    it('default payment per view', () => {
      const post = { ...textPost, payment: 0.00001, viewedStatus: 'NOT_VIEWED' }
      const { queryByAccessibilityLabel } = setup({ post })

      expect(queryByAccessibilityLabel(a11y.unlock)).toBeFalsy()
    })

    it('viewed post', () => {
      const post = { ...textPost, payment: 0.00002, viewedStatus: 'VIEWED' }
      const { queryByAccessibilityLabel } = setup({ post })

      expect(queryByAccessibilityLabel(a11y.unlock)).toBeFalsy()
    })

    it('unpaid post', () => {
      const postsPayRequest = jest.spyOn(postsActions, 'postsPayRequest').mockReturnValue({ type: 'MOCK' })
      const post = { ...textPost, payment: 0.00002, viewedStatus: 'NOT_VIEWED' }
      const { queryByAccessibilityLabel, getByText } = setup({ post })
      const $unlock = queryByAccessibilityLabel(a11y.unlock)

      expect($unlock).toBeTruthy()
      expect(getByText(`This post costs $${post.payment} REAL Coins`)).toBeTruthy()

      fireEvent.press(getByText('Pay & Continue'))
      expect(postsPayRequest).toHaveBeenCalledWith({ postId: post.postId })
    })
  })
})
