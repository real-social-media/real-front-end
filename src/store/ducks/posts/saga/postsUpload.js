import { call, put, takeEvery } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import path from 'ramda/src/path'
import compose from 'ramda/src/compose'
import toLower from 'ramda/src/toLower'
import * as actions from 'store/ducks/posts/actions'
import RNFS from 'react-native-fs'
import filePath from 'path'

function initPostsCreateUploadChannel({ image, uploadUrl, payload }) {
  const getName = (image) => {
    return filePath.basename(image).replace(/\.[^/.]+$/, '').toLowerCase()
  }

  const getFilename = (image) => {
    return compose(toLower, filePath.basename)(image)
  }

  const getFilepath = (image) => {
    return image
  }

  const getFiletype = (image) => {
    if (toLower(image.imageFormat) === 'heic')
      return 'image/heic'

    if (toLower(image.imageFormat) === 'jpg' || toLower(image.imageFormat) === 'jpeg')
      return 'image/jpeg'

    return 'video/mp4'
  }

  const files = [{
    name: getName(image),
    filename: getFilename(image),
    filepath: getFilepath(image),
    filetype: getFiletype(payload),
  }]

  const handleRequest = (emitter) => (response) => {
    const jobId = response.jobId
    emitter({ status: 'retry', progress: 0, jobId })
  }

  const handleProgress = (emitter) => (response) => {
    const jobId = response.jobId
    const progress = parseInt((response.totalBytesSent / response.totalBytesExpectedToSend) * 100, 10)

    if (progress % 10 === 0) {
      const nextProgress = progress === 100 ? 99 : progress
      emitter({ status: 'progress', progress: nextProgress, jobId })
    }
  }

  const handleSuccess = (emitter) => (response) => {
    const jobId = response.jobId
    emitter({ status: 'success', progress: 99, jobId })
    emitter(END)
  }

  const handleFailure = (emitter) => () => {
    emitter({ status: 'failure', progress: 0 })
    emitter(END)
  }

  const initUpload = () => (begin, progress) =>
    RNFS.uploadFiles({
      binaryStreamOnly: true,
      toUrl: uploadUrl,
      files: files,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      begin,
      progress,
    })

  /**
   *
   */
  return eventChannel((emitter) => {
    const uploader = initUpload(emitter)(handleRequest(emitter), handleProgress(emitter))

    const next = (response) => {
      if (response.statusCode === 200) {
        handleSuccess(emitter)(response)
      } else {
        handleFailure(emitter)(response)
      }
    }

    const fail = (error) => {
      handleFailure(emitter)(error)
    }

    uploader.promise.then(next).catch(fail)

    return () => {
      RNFS.stopUpload(uploader.jobId)
    }
  })
}

/**
 *
 */
function* postsUploadRequest(uploadUrl, post) {
  const channel = yield call(initPostsCreateUploadChannel, {
    uploadUrl: uploadUrl,
    image: path(['images', 0])(post),
    payload: post,
  })

  yield takeEvery(channel, function* (upload) {
    const meta = (nextProgress) => ({
      attempt: upload.attempt || post.attempt,
      progress: nextProgress || parseInt(upload.progress, 10),
      error: upload.error,
      jobId: upload.jobId,
    })

    if (upload.status === 'progress') {
      yield put(actions.postsCreateProgress({ data: {}, payload: post, meta: meta() }))
    }

    if (upload.status === 'success') {
      yield put(actions.postsCreateProgress({ data: {}, payload: post, meta: meta(99) }))
    }

    if (upload.status === 'failure') {
      throw new Error('Posts Create Failure')
    }
  })
}

export default postsUploadRequest
