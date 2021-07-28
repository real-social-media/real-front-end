import { all, put, fork, take, flush, actionChannel, call, select, delay } from 'redux-saga/effects'
import { buffers } from 'redux-saga'
import path from 'ramda/src/path'
import uniq from 'ramda/src/uniq'
import splitEvery from 'ramda/src/splitEvery'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as constants from 'store/ducks/posts/constants'
import * as entitiesActions from 'store/ducks/entities/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as queryService from 'services/Query'

function* handlePostsReportPostViewsRequest(payload) {
  const data = payload.postIds.reduce((acc, item) => {
    acc[item] = { commentsUnviewedCount: 0 }
    return acc
  }, {})

  yield put(entitiesActions.entitiesPostsMerge({ data }))
}

export function* postsReportPostViewsRequest(req) {
  try {
    const userId = yield select(authSelector.authUserId)

    if (!userId) return

    const data = yield call([queryService, 'apiRequest'], queries.reportPostViews, req.payload)
    const selector = path(['data', 'reportPostViews'])
    const meta = {}

    if (req.payload.viewType === 'FOCUS') {
      yield handlePostsReportPostViewsRequest(req.payload)
    }

    yield put(actions.postsReportPostViewsSuccess({ data: selector(data), payload: req.payload, meta }))
  } catch (error) {
    yield put(actions.postsReportPostViewsFailure(error))
  }
}

export function groupActionsByType(actions) {
  const { focus, thumbnails } = actions.reduce(
    (acc, action) => {
      const { postIds, viewType } = action.payload

      if (viewType === 'FOCUS') {
        acc.focus.push(...postIds)
      }

      if (viewType === 'THUMBNAIL') {
        acc.thumbnails.push(...postIds)
      }

      return acc
    },
    { focus: [], thumbnails: [] },
  )

  return [uniq(focus), uniq(thumbnails)]
}

export function packActions(grouped) {
  return [
    ...splitEvery(50, grouped[0]).map((postIds) => ({ postIds, viewType: 'FOCUS' })),
    ...splitEvery(50, grouped[1]).map((postIds) => ({ postIds, viewType: 'THUMBNAIL' })),
  ]
}

/**
 * handle throttling and caching for postsReportPostViews
 * used to minimize network requests and send them as batch instead
 */
function* watchPostsReportPostViewsRequest() {
  const channel = yield actionChannel(constants.POSTS_REPORT_POST_VIEWS_REQUEST, buffers.expanding(20))

  while (true) {
    /**
     * get first received action, wait for 10secs while accumulating other actions
     */
    const firstAction = yield take(channel)

    yield delay(3000)
    const accumedActions = yield flush(channel)
    const preparedActions = packActions(groupActionsByType([firstAction, ...accumedActions]))

    /**
     * report views in parallel without blocking the thread
     */
    yield all(preparedActions.map((payload) => fork(postsReportPostViewsRequest, { payload })))
  }
}

export default () => [fork(watchPostsReportPostViewsRequest)]
