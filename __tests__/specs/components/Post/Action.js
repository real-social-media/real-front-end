import React from 'react'
import { renderWithProviders, fireEvent, within } from 'tests/utils'
import PrivacyService from 'services/Privacy'
import ActionComponent from 'components/Post/Action'
import { useNavigation } from '@react-navigation/native'
import testIDs from 'components/Post/test-ids'

jest.mock('services/Privacy', () => ({
  postLikeVisibility: jest.fn().mockReturnValue(true),
  postShareVisibility: jest.fn().mockReturnValue(true),
  postCommentVisibility: jest.fn().mockReturnValue(true),
  postSeenByVisility: jest.fn().mockReturnValue(true),
}))

jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn() }))

const post = {
  postId: '1',
  likeStatus: 'NOT_LIKED',
  postedAt: new Date().toISOString(),
  postedBy: { userId: '2' },
  viewedByCount: 99,
}
const user = { userId: '22' }
const requiredProps = { post, user }

const setup = (props) => renderWithProviders(<ActionComponent {...requiredProps} {...props} />)

describe('Post actions', () => {
  afterEach(() => {
    PrivacyService.postLikeVisibility.mockClear()
    PrivacyService.postShareVisibility.mockClear()
    PrivacyService.postCommentVisibility.mockClear()
    PrivacyService.postSeenByVisility.mockClear()
  })

  describe('Sharing button', () => {
    it('visibility service with called with right params', () => {
      setup()

      expect(PrivacyService.postShareVisibility).toHaveBeenCalledWith(post, user)
    })

    it('visible', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.action.shareBtn)).toBeTruthy()
    })

    it('hidden', () => {
      PrivacyService.postShareVisibility.mockReturnValueOnce(false)
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.action.shareBtn)).toBeFalsy()
    })

    it('callback on press', () => {
      const handlePostShare = jest.fn()
      const { queryByTestId } = setup({ handlePostShare })
      const $shareBtn = queryByTestId(testIDs.action.shareBtn)

      expect($shareBtn).toBeTruthy()

      fireEvent.press($shareBtn)
      expect(handlePostShare).toHaveBeenCalled()
    })
  })

  describe('Like button', () => {
    const notLikedPost = { ...post, likeStatus: 'NOT_LIKED' }

    it('visibility service with called with right params', () => {
      setup({ post: notLikedPost })

      expect(PrivacyService.postLikeVisibility).toHaveBeenCalledWith(notLikedPost, user)
    })

    it('visible', () => {
      const { queryByTestId } = setup({ post: notLikedPost })

      expect(queryByTestId(testIDs.action.likeBtn)).toBeTruthy()
    })

    it('hidden', () => {
      PrivacyService.postLikeVisibility.mockReturnValueOnce(false)
      const { queryByTestId } = setup({ post: notLikedPost })

      expect(queryByTestId(testIDs.action.likeBtn)).toBeFalsy()
    })

    it('callback on press', () => {
      const postsOnymouslyLikeRequest = jest.fn()
      const { queryByTestId } = setup({ postsOnymouslyLikeRequest, post: notLikedPost })
      const $likeBtn = queryByTestId(testIDs.action.likeBtn)

      expect($likeBtn).toBeTruthy()

      fireEvent.press($likeBtn)
      expect(postsOnymouslyLikeRequest).toHaveBeenCalledWith({ postId: post.postId })

      expect(queryByTestId(testIDs.action.likeBtn)).toBeFalsy()
      expect(queryByTestId(testIDs.action.dislikeBtn)).toBeTruthy()
    })
  })

  describe('Dislike button', () => {
    const likedPost = { ...post, likeStatus: 'ONYMOUSLY_LIKED' }

    it('visibility service with called with right params', () => {
      setup({ post: likedPost })

      expect(PrivacyService.postLikeVisibility).toHaveBeenCalledWith(likedPost, user)
    })

    it('visible', () => {
      const { queryByTestId } = setup({ post: likedPost })

      expect(queryByTestId(testIDs.action.dislikeBtn)).toBeTruthy()
    })

    it('hidden', () => {
      PrivacyService.postLikeVisibility.mockReturnValueOnce(false)
      const { queryByTestId } = setup({ post: likedPost })

      expect(queryByTestId(testIDs.action.dislikeBtn)).toBeFalsy()
    })

    it('callback on press', () => {
      const postsDislikeRequest = jest.fn()
      const { queryByTestId } = setup({ postsDislikeRequest, post: likedPost })
      const $dislikeBtn = queryByTestId(testIDs.action.dislikeBtn)

      expect($dislikeBtn).toBeTruthy()

      fireEvent.press($dislikeBtn)
      expect(postsDislikeRequest).toHaveBeenCalledWith({ postId: post.postId })

      expect(queryByTestId(testIDs.action.dislikeBtn)).toBeFalsy()
      expect(queryByTestId(testIDs.action.likeBtn)).toBeTruthy()
    })
  })

  describe('Comment button', () => {
    it('visibility service with called with right params', () => {
      setup()

      expect(PrivacyService.postCommentVisibility).toHaveBeenCalledWith(post, user)
    })

    it('visible', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.action.commentBtn)).toBeTruthy()
    })

    it('hidden', () => {
      PrivacyService.postCommentVisibility.mockReturnValueOnce(false)
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.action.commentBtn)).toBeFalsy()
    })

    it('callback on press', () => {
      const navigation = { push: jest.fn() }
      useNavigation.mockReturnValue(navigation)
      const { queryByTestId } = setup()
      const $commentBtn = queryByTestId(testIDs.action.commentBtn)

      expect($commentBtn).toBeTruthy()

      fireEvent.press($commentBtn)
      expect(navigation.push).toHaveBeenCalledWith('Comments', { postId: post.postId })
    })
  })

  describe('Seen by button', () => {
    it('visibility service with called with right params', () => {
      setup()

      expect(PrivacyService.postSeenByVisility).toHaveBeenCalledWith(post, user)
    })

    it('visible', () => {
      const { queryByTestId } = setup()
      const $seenByBtn = within(queryByTestId(testIDs.action.seenByBtn))

      expect($seenByBtn).toBeTruthy()
      expect($seenByBtn.getByText(`Seen by ${post.viewedByCount} people`)).toBeTruthy()
      expect(queryByTestId(testIDs.action.postedAt)).toBeFalsy()
    })

    it('hidden', () => {
      PrivacyService.postSeenByVisility.mockReturnValueOnce(false)
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.action.seenByBtn)).toBeFalsy()
      expect(queryByTestId(testIDs.action.postedAt)).toBeTruthy()
    })

    it('callback on press', () => {
      const navigation = { push: jest.fn() }
      useNavigation.mockReturnValue(navigation)
      const { queryByTestId } = setup()
      const $seenByBtn = queryByTestId(testIDs.action.seenByBtn)

      expect($seenByBtn).toBeTruthy()

      fireEvent.press($seenByBtn)
      expect(navigation.push).toHaveBeenCalledWith('PostViews', { postId: post.postId })
    })
  })
})
