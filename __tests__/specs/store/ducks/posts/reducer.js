import { combineReducers } from 'redux'
import { applyActions } from 'tests/utils/helpers'
import posts from 'store/ducks/posts/reducer'
import * as actions from 'store/ducks/posts/actions'
import * as selectors from 'store/ducks/posts/selectors'

const reducer = combineReducers({ posts })

describe('Posts reducer', () => {
  describe('postsGetTrendingPosts', () => {
    const data = [{ id: 1 }, { id: 2 }]
    const meta = { a: 1, b: 2 }
    const selectPostsGetTrendingPosts = selectors.postsGetTrendingPosts()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK_ACTION' })

      expect(selectPostsGetTrendingPosts(state)).toEqual({
        data: [],
        meta: {},
        payload: {},
        status: 'idle',
        filters: {},
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.postsGetTrendingPostsSuccess({ data, meta }))

      expect(selectPostsGetTrendingPosts(state)).toEqual({
        data,
        meta,
        payload: {},
        status: 'success',
        filters: {},
      })
    })

    it('not clear data on request', () => {
      const state = applyActions(
        [actions.postsGetTrendingPostsSuccess({ data, meta }), actions.postsGetTrendingPostsRequest()],
        reducer,
      )

      expect(selectPostsGetTrendingPosts(state)).toEqual({
        data,
        meta: {},
        payload: undefined,
        status: 'loading',
        filters: {},
      })
    })

    it('filters', () => {
      const filters = { a: 1, b: 2 }
      const state = reducer(undefined, actions.postsGetTrendingPostsChangeFilters(filters))

      expect(selectors.postsGetTrendingPostsFilters(state)).toEqual(filters)
    })
  })

  describe('postsSingleGet', () => {
    const data = { id: 1 }
    const meta = { a: 1, b: 2 }
    const payload = { postId: 'id123', userId: 'id434' }
    const selectPostsSingleGet = selectors.postsSingleGet()

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK_ACTION' })

      expect(selectPostsSingleGet(state)).toEqual({
        data: {},
        meta: {},
        payload: {},
        status: 'idle',
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.postsSingleGetSuccess({ data, payload, meta }))

      expect(selectPostsSingleGet(state)).toEqual({
        data,
        meta: {},
        payload: {},
        status: 'success',
      })
    })

    it('not clear data on request', () => {
      const state = applyActions(
        [actions.postsSingleGetSuccess({ data, meta }), actions.postsSingleGetRequest()],
        reducer,
      )

      expect(selectPostsSingleGet(state)).toEqual({
        data,
        meta: {},
        payload: undefined,
        status: 'loading',
      })
    })

    it('error state', () => {
      const error = new Error('Error')
      const state = reducer(undefined, actions.postsSingleGetFailure(error))

      expect(selectPostsSingleGet(state)).toEqual({
        data: {},
        meta: {},
        payload: {},
        status: 'failure',
      })
    })

    it('idle', () => {
      const state = applyActions([actions.postsSingleGetSuccess({ data, meta }), actions.postsSingleGetIdle()], reducer)

      expect(selectPostsSingleGet(state)).toEqual({
        data: {},
        meta: {},
        payload: {},
        status: 'idle',
      })
    })
  })

  describe('postsShare', () => {
    const data = { id: 1 }
    const meta = { a: 1, b: 2 }

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK_ACTION' })

      expect(selectors.postsShare(state)).toEqual({
        data: {},
        status: 'idle',
        payload: {},
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.postsShareSuccess({ data, meta }))

      expect(selectors.postsShare(state)).toEqual({
        data,
        payload: {},
        status: 'success',
      })
    })

    it('error state', () => {
      const error = new Error('Error')
      const state = reducer(undefined, actions.postsShareFailure(error))

      expect(selectors.postsShare(state)).toEqual({
        data: {},
        payload: {},
        status: 'failure',
      })
    })

    it('idle', () => {
      const state = applyActions([actions.postsShareSuccess({ data, meta }), actions.postsShareIdle()], reducer)

      expect(selectors.postsShare(state)).toEqual({
        data: {},
        status: 'idle',
        payload: {},
      })
    })
  })

  describe('postsSimilar', () => {
    const data = [{ id: 1 }]
    const meta = { nextToken: 'nextToken' }
    const payload = { postId: '1' }

    it('initial state', () => {
      const state = reducer(undefined, { type: 'MOCK_ACTION' })

      expect(selectors.postsSimilarRoot(state)).toEqual({
        data: [],
        status: 'idle',
        payload: {},
        meta: {},
      })
    })

    it('loading', () => {
      const state = reducer(undefined, actions.postsSimilarRequest(payload))

      expect(selectors.postsSimilarRoot(state)).toEqual({
        data: [],
        status: 'loading',
        payload,
        meta: {},
      })
    })

    it('success', () => {
      const state = reducer(undefined, actions.postsSimilarSuccess({ data, meta }))

      expect(selectors.postsSimilarRoot(state)).toEqual({
        data,
        status: 'success',
        payload: {},
        meta,
      })
    })

    it('error state', () => {
      const error = new Error('Error')
      const state = reducer(undefined, actions.postsSimilarFailure(error))

      expect(selectors.postsSimilarRoot(state)).toEqual({
        data: [],
        status: 'failure',
        payload: {},
        meta: {},
      })
    })

    it('idle', () => {
      const state = applyActions([actions.postsSimilarSuccess({ data, meta }), actions.postsSimilarIdle()], reducer)

      expect(selectors.postsSimilarRoot(state)).toEqual({
        data: [],
        status: 'idle',
        payload: {},
        meta: {},
      })
    })
  })
})
