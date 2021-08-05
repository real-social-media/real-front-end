import { combineReducers } from 'redux'
import users from 'store/ducks/users/reducer'
import * as actions from 'store/ducks/users/actions'
import * as selectors from 'store/ducks/users/selectors'
import { applyActions, testReducer } from 'tests/utils/helpers'

const reducer = combineReducers({ users })
const error = new Error('Error')

describe('Users reducer', () => {
  describe('usersChangeAvatar', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'idle' })
    })

    it('loading', () => {
      const state = reducer(undefined, actions.usersChangeAvatarRequest())

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'loading' })
    })

    it('success', () => {
      const state = reducer(undefined, actions.usersChangeAvatarSuccess())

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'success' })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersChangeAvatarFailure(error))

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'failure' })
    })

    it('idle', () => {
      const state = applyActions(
        [actions.usersChangeAvatarSuccess(), actions.usersChangeAvatarFailure(error), actions.usersChangeAvatarIdle()],
        reducer,
      )

      expect(selectors.usersChangeAvatar(state)).toEqual({ status: 'idle' })
    })
  })

  describe('usersImagePostsGet', () => {
    const selector = selectors.usersImagePostsGetSelector

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selector(state)).toEqual({
        data: [],
        status: 'idle',
        payload: {},
      })
    })

    it('loading', () => {
      const payload = { userId: '1' }
      const state = reducer(undefined, actions.usersImagePostsGetRequest(payload))

      expect(selector(state)).toEqual({
        data: [],
        status: 'loading',
        payload,
      })
    })

    it('success', () => {
      const data = [{ id: 1 }]
      const state = reducer(undefined, actions.usersImagePostsGetSuccess({ data }))

      expect(selector(state)).toEqual({
        data,
        status: 'success',
        payload: {},
      })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersImagePostsGetFailure(error))

      expect(selector(state)).toEqual({
        data: [],
        status: 'failure',
        payload: {},
      })
    })
  })

  describe('usersSetUserDatingStatus', () => {
    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'idle',

        payload: {},
      })
    })

    it('loading', () => {
      const payload = { userId: '1' }
      const state = reducer(undefined, actions.usersSetUserDatingStatusRequest(payload))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'loading',

        payload,
      })
    })

    it('success', () => {
      const data = [{ id: 1 }]
      const state = reducer(undefined, actions.usersSetUserDatingStatusSuccess({ data }))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data,
        status: 'success',
        payload: {},
      })
    })

    it('failure', () => {
      const state = reducer(undefined, actions.usersSetUserDatingStatusFailure(error))

      expect(selectors.usersSetUserDatingStatus(state)).toEqual({
        data: [],
        status: 'failure',
        payload: {},
      })
    })
  })

  describe('usersSearch', () => {
    const selector = selectors.usersSearch()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK' })

      expect(selector(state)).toEqual({ data: [], status: 'idle', payload: {} })
    })
  })

  describe('usersAcceptFollowerUser', () => {
    it('initial state', () => {
      testReducer(reducer).expect(selectors.usersAcceptFollowerUser, { status: 'idle', payload: {} })
    })

    it('loading', () => {
      const payload = { userId: 1 }

      testReducer(reducer)
        .put(actions.usersAcceptFollowerUserRequest(payload))
        .expect(selectors.usersAcceptFollowerUser, { status: 'loading', payload })
    })

    it('success', () => {
      testReducer(reducer)
        .put(actions.usersAcceptFollowerUserSuccess())
        .expect(selectors.usersAcceptFollowerUser, { status: 'success', payload: {} })
    })

    it('failure', () => {
      const error = new Error('Error')

      testReducer(reducer)
        .put(actions.usersAcceptFollowerUserSuccess())
        .put(actions.usersAcceptFollowerUserFailure(error))
        .expect(selectors.usersAcceptFollowerUser, { status: 'failure', payload: {} })
    })

    it('idle', () => {
      testReducer(reducer)
        .put(actions.usersAcceptFollowerUserIdle())
        .expect(selectors.usersAcceptFollowerUser, { status: 'idle', payload: {} })
    })
  })

  describe('usersDeclineFollowerUser', () => {
    it('initial state', () => {
      testReducer(reducer).expect(selectors.usersDeclineFollowerUser, { status: 'idle', payload: {} })
    })

    it('loading', () => {
      const payload = { userId: 1 }

      testReducer(reducer)
        .put(actions.usersDeclineFollowerUserRequest(payload))
        .expect(selectors.usersDeclineFollowerUser, { status: 'loading', payload })
    })

    it('success', () => {
      testReducer(reducer)
        .put(actions.usersDeclineFollowerUserSuccess())
        .expect(selectors.usersDeclineFollowerUser, { status: 'success', payload: {} })
    })

    it('failure', () => {
      const error = new Error('Error')

      testReducer(reducer)
        .put(actions.usersDeclineFollowerUserSuccess())
        .put(actions.usersDeclineFollowerUserFailure(error))
        .expect(selectors.usersDeclineFollowerUser, { status: 'failure', payload: {} })
    })

    it('idle', () => {
      testReducer(reducer)
        .put(actions.usersDeclineFollowerUserIdle())
        .expect(selectors.usersDeclineFollowerUser, { status: 'idle', payload: {} })
    })
  })

  describe('usersUnfollow', () => {
    it('initial state', () => {
      testReducer(reducer).expect(selectors.usersUnfollow, { status: 'idle', payload: {} })
    })

    it('loading', () => {
      const payload = { userId: 1 }

      testReducer(reducer)
        .put(actions.usersUnfollowRequest(payload))
        .expect(selectors.usersUnfollow, { status: 'loading', payload })
    })

    it('success', () => {
      testReducer(reducer)
        .put(actions.usersUnfollowSuccess())
        .expect(selectors.usersUnfollow, { status: 'success', payload: {} })
    })

    it('failure', () => {
      const error = new Error('Error')

      testReducer(reducer)
        .put(actions.usersUnfollowSuccess())
        .put(actions.usersUnfollowFailure(error))
        .expect(selectors.usersUnfollow, { status: 'failure', payload: {} })
    })

    it('idle', () => {
      testReducer(reducer)
        .put(actions.usersUnfollowIdle())
        .expect(selectors.usersUnfollow, { status: 'idle', payload: {} })
    })
  })

  describe('usersFollow', () => {
    it('initial state', () => {
      testReducer(reducer).expect(selectors.usersFollow, { status: 'idle', payload: {} })
    })

    it('loading', () => {
      const payload = { userId: 1 }

      testReducer(reducer)
        .put(actions.usersFollowRequest(payload))
        .expect(selectors.usersFollow, { status: 'loading', payload })
    })

    it('success', () => {
      testReducer(reducer)
        .put(actions.usersFollowSuccess())
        .expect(selectors.usersFollow, { status: 'success', payload: {} })
    })

    it('failure', () => {
      const error = new Error('Error')

      testReducer(reducer)
        .put(actions.usersFollowSuccess())
        .put(actions.usersFollowFailure(error))
        .expect(selectors.usersFollow, { status: 'failure', payload: {} })
    })

    it('idle', () => {
      testReducer(reducer)
        .put(actions.usersFollowIdle())
        .expect(selectors.usersFollow, { status: 'idle', payload: {} })
    })
  })
})
