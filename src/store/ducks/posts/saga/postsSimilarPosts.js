import { takeLatest, put, call } from 'redux-saga/effects'
import * as constants from 'store/ducks/posts/constants'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import { entitiesMerge } from 'store/ducks/entities/saga'

function* postsSimilarRequest(req) {
  try {
    const response = yield call([queryService, 'apiRequest'], queries.similarPosts, {
      postId: req.payload.postId,
      limit: 20,
    })
    const { items, nextToken } = response.data.similarPosts
    const normalized = normalizer.normalizePostsGet(items)

    yield call(entitiesMerge, normalized)
    yield put(actions.postsSimilarSuccess({ data: normalized.result, meta: { nextToken } }))
  } catch (error) {
    yield put(actions.postsSimilarFailure(error))
  }
}

export default () => [takeLatest(constants.POSTS_SIMILAR_REQUEST, postsSimilarRequest)]
