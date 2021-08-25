import { put, call, takeLatest } from 'redux-saga/effects'
import path from 'ramda/src/path'
import compose from 'ramda/src/compose'
import omit from 'ramda/src/omit'
import * as constants from 'store/ducks/posts/constants'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import { entitiesMerge } from 'store/ducks/entities/saga'

/**
 *
 */
function* postsByCoinRequestData(req, api) {
  const dataSelector = path(['data', 'postsByPaymentTicker', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'postsByPaymentTicker']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizePostsGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* postsByCoinRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.postsByPaymentTicker, req.payload)
    const next = yield postsByCoinRequestData(req, data)
    yield put(actions.postsByCoinSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsByCoinFailure(error, req.payload))
  }
}

function* postsByCoinMoreRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.postsByPaymentTicker, req.payload)
    const next = yield postsByCoinRequestData(req, data)
    yield put(actions.postsByCoinMoreSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsByCoinMoreFailure(error, req.payload))
  }
}

export default () => [
  takeLatest(constants.POSTS_BY_COIN_GET_REQUEST, postsByCoinRequest),
  takeLatest(constants.POSTS_BY_COIN_GET_MORE_REQUEST, postsByCoinMoreRequest),
]
