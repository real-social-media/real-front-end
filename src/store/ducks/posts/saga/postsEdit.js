import path from 'ramda/src/path'
import { put, takeLatest, call } from 'redux-saga/effects'
import * as normalizer from 'normalizer/schemas'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as constants from 'store/ducks/posts/constants'
import * as queryService from 'services/Query'
import * as lifetime from 'services/helpers/lifetime'
import { entitiesMerge } from 'store/ducks/entities/saga'

/**
 *
 */
function* handlePostsEditRequest(values) {
  yield call([queryService, 'apiRequest'], queries.editPostExpiresAt, {
    postId: values.postId,
    expiresAt: lifetime.getExpiredDate(values.lifetime),
  })

  yield call([queryService, 'apiRequest'], queries.editPostAlbum, values)
  return yield call([queryService, 'apiRequest'], queries.editPost, values)
}

function* postsEditRequestData(req, api) {
  const dataSelector = path(['data', 'editPost'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizePostGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* postsEditRequest(req) {
  try {
    const data = yield handlePostsEditRequest(req.payload)
    const next = yield postsEditRequestData(req, data)
    yield put(actions.postsEditSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsEditFailure(error, req.payload))
  }
}

export default () => [takeLatest(constants.POSTS_EDIT_REQUEST, postsEditRequest)]
