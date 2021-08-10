import { put, takeLatest, call } from 'redux-saga/effects'
import path from 'ramda/src/path'
import compose from 'ramda/src/compose'
import omit from 'ramda/src/omit'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as constants from 'store/ducks/posts/constants'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import usersCheckPermissions from 'store/ducks/users/saga/usersCheckPermissions'
import { entitiesMerge } from 'store/ducks/entities/saga'
import postsPay from 'store/ducks/posts/saga/postsPay'
import postsSimilarPosts from 'store/ducks/posts/saga/postsSimilarPosts'
import postsReportPostViews from 'store/ducks/posts/saga/postsReportPostViews'
import postsGetTrendingPosts from 'store/ducks/posts/saga/postsGetTrendingPosts'

/**
 *
 */
function* postsGetRequestData(req, api) {
  const dataSelector = path(['data', 'user', 'posts', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'user', 'posts']))

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

function* postsGetRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getPosts, { ...req.payload, postStatus: 'COMPLETED' })
    const next = yield postsGetRequestData(req, data)
    yield put(actions.postsGetSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsGetFailure(error, req.payload))
  }
}

function* postsGetMoreRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getPosts, { ...req.payload, postStatus: 'COMPLETED' })
    const next = yield postsGetRequestData(req, data)
    yield put(actions.postsGetMoreSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsGetMoreFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsGetUnreadCommentsRequestData(req, api) {
  const dataSelector = path(['data', 'self', 'postsWithUnviewedComments', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'self', 'postsWithUnviewedComments']))

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

function* postsGetUnreadCommentsRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getPostsUnreadComments, req.payload)
    const next = yield postsGetUnreadCommentsRequestData(req, data)
    yield put(actions.postsGetUnreadCommentsSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsGetUnreadCommentsFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsViewsGetRequestData(req, api) {
  const dataSelector = path(['data', 'post', 'viewedBy', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'post', 'viewedBy']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* postsViewsGetRequest(req) {


  try {
    const data = yield call([queryService, 'apiRequest'], queries.viewedBy, req.payload)
    const next = yield postsViewsGetRequestData(req, data)
    yield put(actions.postsViewsGetSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsViewsGetFailure(error, req.payload))
  }
}

function* postsViewsGetMoreRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.viewedBy, req.payload)
    const next = yield postsViewsGetRequestData(req, data)
    yield put(actions.postsViewsGetMoreSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsViewsGetMoreFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsLikesGetRequestData(req, api) {
  const dataSelector = path(['data', 'post', 'onymouslyLikedBy', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'post', 'onymouslyLikedBy']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* postsLikesGetRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.onymouslyLikedBy, req.payload)
    const next = yield postsLikesGetRequestData(req, data)
    yield put(actions.postsLikesGetSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsLikesGetFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsFeedGetRequestData(req, api) {
  const dataSelector = path(['data', 'self', 'feed', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'self', 'feed']))

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

function* postsFeedGetRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getFeed, req.payload)
    const next = yield postsFeedGetRequestData(req, data)
    yield put(actions.postsFeedGetSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsFeedGetFailure(error, req.payload))
  }
}

function* postsFeedGetMoreRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getFeed, req.payload)
    const next = yield postsFeedGetRequestData(req, data)
    yield put(actions.postsFeedGetMoreSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsFeedGetMoreFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsGetArchivedRequestData(req, api) {
  const dataSelector = path(['data', 'user', 'posts', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'user', 'posts']))

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

function* postsGetArchivedRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getPosts, { ...req.payload, postStatus: 'ARCHIVED' })
    const next = yield postsGetArchivedRequestData(req, data)
    yield put(actions.postsGetArchivedSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsGetArchivedFailure(error, req.payload))
  }
}

/**
 *
 */
function* handlePostsEditRequest(payload) {
  yield call([queryService, 'apiRequest'], queries.editPostExpiresAt, payload)
  yield call([queryService, 'apiRequest'], queries.editPostAlbum, payload)
  return yield call([queryService, 'apiRequest'], queries.editPost, payload)
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

/**
 *
 */
function* postsDeleteRequestData(req, api) {
  const dataSelector = path(['data', 'deletePost'])

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

function* postsDeleteRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.deletePost, req.payload)
    const next = yield postsDeleteRequestData(req, data)

    yield put(actions.postsDeleteSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsDeleteFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsArchiveRequestData(req, api) {
  const dataSelector = path(['data', 'archivePost'])

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

function* postsArchiveRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.archivePost, req.payload)
    const next = yield postsArchiveRequestData(req, data)
    yield put(actions.postsArchiveSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsArchiveFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsRestoreArchivedRequestData(req, api) {
  const dataSelector = path(['data', 'restoreArchivedPost'])

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

function* postsRestoreArchivedRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.restoreArchivedPost, req.payload)
    const next = yield postsRestoreArchivedRequestData(req, data)
    yield put(actions.postsRestoreArchivedSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsRestoreArchivedFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsFlagRequestData(req, api) {
  const dataSelector = path(['data', 'flagPost'])

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

function* postsFlagRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.flagPost, req.payload)
    const next = yield postsFlagRequestData(req, data)
    yield put(actions.postsFlagSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsFlagFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsSingleGetRequestData(req, api) {
  const dataSelector = path(['data', 'post'])

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

function* postsSingleGetRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.getPost, req.payload)
    const next = yield postsSingleGetRequestData(req, data)
    yield put(actions.postsSingleGetSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsSingleGetFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsOnymouslyLikeRequestData(req, api) {
  const dataSelector = path(['data', 'onymouslyLikePost'])

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

function* postsOnymouslyLikeRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield call([queryService, 'apiRequest'], queries.onymouslyLikePost, req.payload)
    const next = yield postsOnymouslyLikeRequestData(req, data)
    yield put(actions.postsOnymouslyLikeSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsOnymouslyLikeFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsDislikeRequestData(req, api) {
  const dataSelector = path(['data', 'dislikePost'])

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

function* postsDislikeRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield call([queryService, 'apiRequest'], queries.dislikePost, req.payload)
    const next = yield postsDislikeRequestData(req, data)
    yield put(actions.postsDislikeSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsDislikeFailure(error, req.payload))
  }
}

/**
 *
 */
function* postsCommentsGetRequestData(req, api) {
  const dataSelector = path(['data', 'post', 'comments', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'post', 'comments']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeCommentsGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* postsCommentsGetRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.comments, req.payload)
    const next = yield postsCommentsGetRequestData(req, data)
    yield put(actions.postsCommentsGetSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.postsCommentsGetFailure(error, req.payload))
  }
}

/**
 *
 */
function* commentsAddRequestData(req, api) {
  const dataSelector = path(['data', 'addComment'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeCommentGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* commentsAddRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield call([queryService, 'apiRequest'], queries.addComment, req.payload)
    const next = yield commentsAddRequestData(req, data)
    yield put(actions.commentsAddSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.commentsAddFailure(error, req.payload))
  }
}

/**
 *
 */
function* commentsDeleteRequestData(req, api) {
  const dataSelector = path(['data', 'deleteComment'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeCommentGet(data)
  yield call(entitiesMerge, normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* commentsDeleteRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.deleteComment, req.payload)
    const next = yield commentsDeleteRequestData(req, data)

    yield put(actions.commentsDeleteSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.commentsDeleteFailure(error, req.payload))
  }
}

function* commentsFlagRequest(req) {
  try {
    const data = yield call([queryService, 'apiRequest'], queries.flagComment, req.payload)
    const selector = path(['data', 'flagComment'])
    const meta = {}

    yield put(actions.commentsFlagSuccess({ data: selector(data), payload: req.payload, meta }))
  } catch (error) {
    yield put(actions.commentsFlagFailure(error, req.payload))
  }
}

/**
 *
 */

function* postsDeleteSuccess(req) {
  yield put(actions.postsDeleteIdle({}))
  yield put(actions.postsGetRequest({ userId: req.payload.payload.userId }))
}

function* postsArchiveSuccess(req) {
  yield put(actions.postsArchiveIdle({}))
  yield put(actions.postsGetRequest({ userId: req.payload.payload.userId }))
}

function* postsRestoreArchivedSuccess(req) {
  yield put(actions.postsRestoreArchivedIdle({}))
  yield put(actions.postsGetRequest({ userId: req.payload.payload.userId }))
}

function* postsFlagSuccess() {
  yield put(actions.postsFlagIdle({}))
}

export default () => [
  takeLatest(constants.POSTS_GET_REQUEST, postsGetRequest),
  takeLatest(constants.POSTS_GET_MORE_REQUEST, postsGetMoreRequest),
  takeLatest(constants.POSTS_GET_UNREAD_COMMENTS_REQUEST, postsGetUnreadCommentsRequest),

  takeLatest(constants.POSTS_VIEWS_GET_REQUEST, postsViewsGetRequest),
  takeLatest(constants.POSTS_VIEWS_GET_MORE_REQUEST, postsViewsGetMoreRequest),

  takeLatest(constants.POSTS_FEED_GET_REQUEST, postsFeedGetRequest),
  takeLatest(constants.POSTS_FEED_GET_MORE_REQUEST, postsFeedGetMoreRequest),

  takeLatest(constants.POSTS_LIKES_GET_REQUEST, postsLikesGetRequest),
  takeLatest(constants.POSTS_GET_ARCHIVED_REQUEST, postsGetArchivedRequest),
  takeLatest(constants.POSTS_EDIT_REQUEST, postsEditRequest),
  takeLatest(constants.POSTS_DELETE_REQUEST, postsDeleteRequest),

  takeLatest(constants.POSTS_ARCHIVE_REQUEST, postsArchiveRequest),
  takeLatest(constants.POSTS_RESTORE_ARCHIVED_REQUEST, postsRestoreArchivedRequest),

  takeLatest(constants.POSTS_FLAG_REQUEST, postsFlagRequest),
  takeLatest(constants.POSTS_SINGLE_GET_REQUEST, postsSingleGetRequest),

  takeLatest(constants.POSTS_ONYMOUSLY_LIKE_REQUEST, postsOnymouslyLikeRequest),
  takeLatest(constants.POSTS_DISLIKE_REQUEST, postsDislikeRequest),

  takeLatest(constants.POSTS_COMMENTS_GET_REQUEST, postsCommentsGetRequest),
  takeLatest(constants.COMMENTS_ADD_REQUEST, commentsAddRequest),
  takeLatest(constants.COMMENTS_DELETE_REQUEST, commentsDeleteRequest),
  takeLatest(constants.COMMENTS_FLAG_REQUEST, commentsFlagRequest),

  takeLatest(constants.POSTS_DELETE_SUCCESS, postsDeleteSuccess),
  takeLatest(constants.POSTS_ARCHIVE_SUCCESS, postsArchiveSuccess),
  takeLatest(constants.POSTS_RESTORE_ARCHIVED_SUCCESS, postsRestoreArchivedSuccess),
  takeLatest(constants.POSTS_FLAG_SUCCESS, postsFlagSuccess),
]
.concat(postsPay())
.concat(postsSimilarPosts())
.concat(postsReportPostViews())
.concat(postsGetTrendingPosts())
