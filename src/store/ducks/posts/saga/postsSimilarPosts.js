import { takeLatest, put, call } from 'redux-saga/effects'
import * as constants from 'store/ducks/posts/constants'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import { entitiesMerge } from 'store/ducks/entities/saga'

function* fetchSimilarPosts({ postId }) {
  const response = yield call([queryService, 'apiRequest'], queries.similarPosts, { postId })
  const { items, nextToken } = response.data.similarPosts
  const normalized = normalizer.normalizePostsGet(items)

  yield call(entitiesMerge, normalized)

  return { data: normalized.result, meta: { nextToken } }
}

function* postsSimilarRequest(req) {
  try {
    const response = yield call(fetchSimilarPosts, req.payload)
    yield put(actions.postsSimilarSuccess(response))
  } catch (error) {
    yield put(actions.postsSimilarFailure(error))
  }
}

function* postsSimilarMoreRequest(req) {
  try {
    const response = yield call(fetchSimilarPosts, req.payload)
    yield put(actions.postsSimilarMoreSuccess(response))
  } catch (error) {
    yield put(actions.postsSimilarMoreFailure(error))
  }
}

export default () => [
  takeLatest(constants.POSTS_SIMILAR_REQUEST, postsSimilarRequest),
  takeLatest(constants.POSTS_SIMILAR_MORE_REQUEST, postsSimilarMoreRequest),
]
