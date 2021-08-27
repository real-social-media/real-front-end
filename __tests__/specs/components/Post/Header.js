import React from 'react'
import { renderWithProviders, fireEvent } from 'tests/utils'
import RNActionSheet from 'react-native-actionsheet'
import PrivacyService from 'services/Privacy'
import HeaderComponent from 'components/Post/Header'
import testIDs from 'components/Post/test-ids'

jest.mock('templates/Avatar', () => () => null)
jest.mock('react-native-actionsheet', () => jest.fn().mockReturnValue(null))
jest.mock('services/Privacy', () => ({
  postRepostVisiblity: jest.fn().mockReturnValue(true),
  postVerificationVisibility: jest.fn().mockReturnValue(true),
  postExpiryVisiblity: jest.fn().mockReturnValue(true),
  postShareVisibility: jest.fn().mockReturnValue(true),
}))

const postId = 1
const postedBy = { userId: '1', username: 'username' }
const user = { userId: '2' }
const post = {
  postId,
  postedBy,
  originalPost: { postedBy: { userId: '2', username: 'username2' } },
  expiresAt: '2020-09-10T05:26:58.746Z',
  isVerified: false,
}
const handlePostShare = jest.fn()
const postsFlagRequest = jest.fn()
const postsArchiveRequest = jest.fn()
const postsDeleteRequest = jest.fn()
const changeAvatarRequest = jest.fn()
const postsRestoreArchivedRequest = jest.fn()
const navigation = { navigate: jest.fn() }
const requiredProps = {
  post,
  user,
  handlePostShare,
  postsFlagRequest,
  postsArchiveRequest,
  postsDeleteRequest,
  changeAvatarRequest,
  postsRestoreArchivedRequest,
  navigation,
}

const setup = (props) => renderWithProviders(<HeaderComponent {...requiredProps} {...props} />)

describe('Post Header component', () => {
  describe('Dropdown menu', () => {
    afterEach(() => {
      RNActionSheet.mockClear()
      handlePostShare.mockClear()
      postsFlagRequest.mockClear()
      postsArchiveRequest.mockClear()
      postsDeleteRequest.mockClear()
      changeAvatarRequest.mockClear()
      postsRestoreArchivedRequest.mockClear()
      navigation.navigate.mockClear()
    })

    it('user is not an owner of a post', () => {
      const user = { userId: '2' }
      const { getByTestId } = setup({ user })

      expect(getByTestId(testIDs.header.openDropDownMenu)).toBeTruthy()

      expect(RNActionSheet).toHaveBeenCalled()
      const { options, cancelButtonIndex, onPress } = RNActionSheet.mock.calls[0][0]

      expect(options).toEqual(['Share', 'Report', 'Cancel'])
      expect(cancelButtonIndex).toBe(2)

      onPress(0)
      expect(handlePostShare).toHaveBeenCalled()

      onPress(1)
      expect(postsFlagRequest).toHaveBeenCalledWith({ postId, userId: user.userId })
    })

    it('user is an owner of a post', () => {
      const user = { userId: post.postedBy.userId }
      const { getByTestId } = setup({ user })

      expect(getByTestId(testIDs.header.openDropDownMenu)).toBeTruthy()

      expect(RNActionSheet).toHaveBeenCalled()
      const { options, cancelButtonIndex, destructiveButtonIndex, onPress } = RNActionSheet.mock.calls[0][0]

      expect(options).toEqual(['Share', 'Edit', 'Archive', 'Delete', 'Cancel'])
      expect(cancelButtonIndex).toBe(4)
      expect(destructiveButtonIndex).toBe(3)

      onPress(0)
      expect(handlePostShare).toHaveBeenCalled()

      onPress(1)
      expect(navigation.navigate).toHaveBeenCalledWith('PostEdit', { post })

      onPress(2)
      expect(postsArchiveRequest).toHaveBeenCalledWith({
        postId: post.postId,
        userId: post.postedBy.userId,
      })

      onPress(3)
      expect(postsDeleteRequest).toHaveBeenCalledWith({
        postId: post.postId,
        userId: post.postedBy.userId,
      })
    })

    it('user is an owner of a post and post archived', () => {
      PrivacyService.postShareVisibility.mockReturnValueOnce(false)
      const user = { userId: post.postedBy.userId }
      const archived = { ...post, postStatus: 'ARCHIVED' }
      const { getByTestId } = setup({ user, post: archived })

      expect(getByTestId(testIDs.header.openDropDownMenu)).toBeTruthy()

      expect(RNActionSheet).toHaveBeenCalled()
      const { options, cancelButtonIndex, onPress } = RNActionSheet.mock.calls[0][0]

      expect(options).toEqual(['Restore from Archived', 'Cancel'])
      expect(cancelButtonIndex).toBe(1)

      onPress(0)
      expect(postsRestoreArchivedRequest).toHaveBeenCalledWith({ postId: archived.postId, userId: user.userId })
    })

    it('user is an owner of a verified post', () => {
      PrivacyService.postShareVisibility.mockReturnValueOnce(false)
      const user = { userId: post.postedBy.userId }
      const verified = { ...post, isVerified: true }
      const { getByTestId } = setup({ user, post: verified })

      expect(getByTestId(testIDs.header.openDropDownMenu)).toBeTruthy()

      expect(RNActionSheet).toHaveBeenCalled()
      const { options, cancelButtonIndex, onPress } = RNActionSheet.mock.calls[0][0]

      expect(options).toEqual(['Set as profile picture', 'Edit', 'Archive', 'Delete', 'Cancel'])
      expect(cancelButtonIndex).toBe(4)

      onPress(0)
      expect(changeAvatarRequest).toHaveBeenCalledWith({ postId: verified.postId })
    })

    describe('Sharing button', () => {
      it('visibility service with called with right params', () => {
        setup()

        expect(PrivacyService.postShareVisibility).toHaveBeenCalledWith(post, user)
      })

      it('hide sharing button', () => {
        PrivacyService.postShareVisibility.mockReturnValueOnce(false)
        setup({ user: { userId: 2 } })

        const { options } = RNActionSheet.mock.calls[0][0]
        expect(options.findIndex((i) => i === 'Share')).toBe(-1)
      })

      it('show sharing button', () => {
        PrivacyService.postShareVisibility.mockReturnValueOnce(true)
        setup({ user: { userId: 2 } })

        const { options } = RNActionSheet.mock.calls[0][0]
        expect(options.findIndex((i) => i === 'Share')).toBe(0)
      })
    })
  })

  describe('Repost button', () => {
    it('visibility service with called with right params', () => {
      setup()

      expect(PrivacyService.postRepostVisiblity).toHaveBeenCalledWith(post)
    })

    it('visible', () => {
      const { queryByTestId, getByText } = setup()

      expect(queryByTestId(testIDs.header.repostBtn)).toBeTruthy()
      getByText(`Reposted from ${post.originalPost.postedBy.username}`)
    })

    it('hidden', () => {
      PrivacyService.postRepostVisiblity.mockReturnValueOnce(false)
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.header.repostBtn)).toBeFalsy()
    })

    it('callback on press', () => {
      const navigation = { push: jest.fn() }
      const { queryByTestId } = setup({ navigation })
      const $repostBtn = queryByTestId(testIDs.header.repostBtn)

      expect($repostBtn).toBeTruthy()

      fireEvent.press($repostBtn)
      expect(navigation.push).toHaveBeenCalledWith('Profile', { userId: post.originalPost.postedBy.userId })
    })
  })

  describe('Expiry', () => {
    it('visibility service with called with right params', () => {
      setup()

      expect(PrivacyService.postExpiryVisiblity).toHaveBeenCalledWith(post)
    })

    it('visible', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.header.expiry)).toBeTruthy()
    })

    it('hidden', () => {
      PrivacyService.postExpiryVisiblity.mockReturnValueOnce(false)
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.header.expiry)).toBeFalsy()
    })
  })

  describe('Verification Status', () => {
    it('visibility service with called with right params', () => {
      setup()

      expect(PrivacyService.postVerificationVisibility).toHaveBeenCalledWith(post)
    })

    it('visible', () => {
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.header.verificationStatus)).toBeTruthy()
    })

    it('hidden', () => {
      PrivacyService.postVerificationVisibility.mockReturnValueOnce(false)
      const { queryByTestId } = setup()

      expect(queryByTestId(testIDs.header.verificationStatus)).toBeFalsy()
    })

    it('callback on press', () => {
      const navigation = { navigate: jest.fn() }
      const { queryByTestId } = setup({ navigation })
      const $verificationStatus = queryByTestId(testIDs.header.verificationStatus)

      expect($verificationStatus).toBeTruthy()

      fireEvent.press($verificationStatus)
      expect(navigation.navigate).toHaveBeenCalledWith('Verification', { actionType: 'BACK' })
    })
  })

  describe('Advertisement post', () => {
    describe('visible', () => {
      it('adStatus ACTIVE', () => {
        const { getByText } = setup({ post: { ...post, adStatus: 'ACTIVE' } })

        expect(getByText('Advertisement')).toBeTruthy()
      })
    })

    describe('hidden', () => {
      it('adStatus NOT_AD', () => {
        const { queryByText } = setup({ post: { ...post, adStatus: 'NOT_AD' } })

        expect(queryByText('Advertisement')).toBeFalsy()
      })

      it('adStatus PENDING', () => {
        const { queryByText } = setup({ post: { ...post, adStatus: 'PENDING' } })

        expect(queryByText('Advertisement')).toBeFalsy()
      })

      it('adStatus INACTIVE', () => {
        const { queryByText } = setup({ post: { ...post, adStatus: 'INACTIVE' } })

        expect(queryByText('Advertisement')).toBeFalsy()
      })
    })
  })

  describe('View coin link', () => {
    it('visible', () => {
      const navigation = { push: jest.fn() }
      const paidPost = { ...post, paymentTicker: 'ALEXO' }
      const { queryByText } = setup({ post: paidPost, navigation })
      const $coinLink = queryByText('View ALEXO coin')

      expect($coinLink).toBeTruthy()

      fireEvent.press($coinLink)
      expect(navigation.push).toHaveBeenCalledWith('CoinPosts', { paymentTicker: 'ALEXO' })
    })

    it('hidden', () => {
      const post = { ...post, paymentTicker: 'REAL' }
      const { queryByText } = setup({ post })

      expect(queryByText('View REAL coin')).toBeFalsy()
    })
  })
})
