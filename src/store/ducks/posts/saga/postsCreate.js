import { graphqlOperation } from '@aws-amplify/api'
import { call, put, takeEvery, getContext, select } from 'redux-saga/effects'
import path from 'ramda/src/path'
import RNFS from 'react-native-fs'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as constants from 'store/ducks/posts/constants'
import * as cameraActions from 'store/ducks/camera/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import postsUploadRequest from 'store/ducks/posts/saga/postsUpload'

/**
 *
 */
const postUploadDefaultValues = (post) => ({
  postId: post.postId || uuid(),
  mediaId: post.mediaId || uuid(),
  createdAt: post.createdAt || dayjs().toJSON(),
  attempt: post.attempt || 0,
  albumId: post.albumId || null,
  postType: post.postType || 'IMAGE',
  text: post.text || '',
  images: post.images || [],
  preview: post.preview || [],
  lifetime: post.lifetime || '',
  commentsDisabled: post.commentsDisabled || false,
  likesDisabled: post.likesDisabled || false,
  sharingDisabled: post.sharingDisabled || false,
  verificationHidden: post.verificationHidden || false,
  takenInReal: post.takenInReal || false,
  payment: parseFloat(post.payment),
  originalFormat: post.originalFormat || 'jpg',
  originalMetadata: post.originalMetadata || '',
  imageFormat: post.imageFormat || 'JPEG',
  crop: post.crop || null,
  keywords: post.keywords || [],
})

/**
 *
 */
function* waitForPostCompleted({ postId }) {
  const AwsAPI = yield getContext('AwsAPI')
  let response

  do {
    yield call(async function sleep() {
      return new Promise((r) => setTimeout(r, 3000))
    })

    response = yield AwsAPI.graphql(graphqlOperation(queries.getPost, { postId }))
  } while (['PENDING', 'PROCESSING'].includes(response.data.post.postStatus))

  return response.data.post
}

/**
 *
 */
function* handleTextOnlyPost(values) {
  const AwsAPI = yield getContext('AwsAPI')

  yield AwsAPI.graphql(graphqlOperation(queries.addTextOnlyPost, values))
}

/**
 *
 */
function* createImagePost(values) {
  const AwsAPI = yield getContext('AwsAPI')

  function* postExists({ postId }) {
    const post = yield AwsAPI.graphql(graphqlOperation(queries.getPost, { postId }))

    if (!post.data.post) {
      throw new Error('Post must be created')
    }

    return post.data.post
  }

  function* postCreate(values) {
    const post = yield AwsAPI.graphql(graphqlOperation(queries.addPhotoPost, values))

    return post.data.addPost
  }

  try {
    return yield call(postExists, values)
  } catch (error) {
    return yield call(postCreate, values)
  }
}

function* handleImagePost(values) {
  const post = yield call(createImagePost, values)

  yield call(postsUploadRequest, post.imageUploadUrl, values)
  yield call(waitForPostCompleted, post)
}

function* postsCreateRequest(req) {
  const values = postUploadDefaultValues(req.payload)

  try {
    if (values.postType !== 'TEXT_ONLY' && values.images.length) {
      yield put(cameraActions.cameraCaptureIdle({ payload: { uri: values.images[0] } }))
    }

    if (values.postType === 'TEXT_ONLY') {
      yield call(handleTextOnlyPost, values)
    } else if (values.postType === 'IMAGE') {
      yield call(handleImagePost, values)
    } else {
      throw new Error('Unsupported post type')
    }

    yield put(actions.postsCreateSuccess({ data: {}, payload: values, meta: {} }, req.meta))
  } catch (error) {
    yield put(actions.postsCreateFailure(error, values))
  }
}

/**
 *
 */
function* postsCreateIdle(req) {
  const jobId = path(['payload', 'meta', 'jobId'])(req)

  if (jobId) {
    yield RNFS.stopUpload(jobId)
  }
}

/**
 * Refresh feeds
 */
function* postsCreateSuccess(req) {
  if (!path(['meta', 'avatar'], req)) {
    const userId = yield select(authSelector.authUserId)

    yield put(actions.postsGetRequest({ userId }))
    yield put(usersActions.usersImagePostsGetRequest({ userId, isVerified: true }))
    yield put(actions.postsFeedGetRequest({ limit: 20 }))
  }
}

export default () => [
  takeEvery(constants.POSTS_CREATE_REQUEST, postsCreateRequest),
  takeEvery(constants.POSTS_CREATE_IDLE, postsCreateIdle),
  takeEvery(constants.POSTS_CREATE_SUCCESS, postsCreateSuccess),
]
