import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/posts/constants'

export const initialState = {
  postsGet: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsSimilar: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsGetUnreadComments: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsViewsGet: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsLikesGet: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsGetArchived: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsEdit: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsDelete: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsArchive: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsRestoreArchived: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsFlag: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsSingleGet: {
    data: {},
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsFeedGet: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsCreate: {
    data: {},
    status: 'idle',
    payload: {
      images: [],
    },
    meta: {},
  },
  postsOnymouslyLike: {
    data: {},
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsDislike: {
    data: {},
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsShare: {
    data: {},
    status: 'idle',
    payload: {},
  },
  postsReportPostViews: {
    data: {},
    status: 'idle',
    payload: {},
    meta: {},
  },
  postsGetTrendingPosts: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
    filters: {},
  },
  postsCommentsGet: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  commentsAdd: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  commentsDelete: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },
  commentsFlag: {
    data: [],
    status: 'idle',
    payload: {},
    meta: {},
  },

  /**
   * postId -> { data: {} }
   */
  postsPool: {

  },

  /**
   * commentId -> { data: {} }
   */
  commentsPool: {

  },

  postsCreateQueue: {},
  postsGetCache: {},
  postsCommentsGetCache: {},
  postsViewsGetCache: {},
  postsLikesGetCache: {},
}

/**
 *
 */
const postsGetRequest = (state, action) => update(state, {
  postsGetCache: {
    $resourceCacheSetRequest: {
      ...action,
      resourceKey: action.payload.userId,
      initialState: initialState.postsGet,
    },
  },
})

const postsGetSuccess = (state, action) => update(state, {
  postsGetCache: {
    $resourceCacheSetSuccess: {
      ...action,
      resourceKey: action.payload.payload.userId,
      initialState: initialState.postsGet,
    },
  },
})

const postsGetFailure = (state, action) => update(state, {
  postsGetCache: {
    $resourceCacheSetFailure: {
      ...action,
      resourceKey: action.meta.userId,
      initialState: initialState.postsGet,
    },
  },
})

const postsGetIdle = (state, action) => update(state, {
  postsGetCache: {
    $resourceCacheSetIdle: {
      ...action,
      resourceKey: action.payload.payload.userId,
      initialState: initialState.postsGet,
    },
  },
})

const postsGetMoreRequest = (state, action) => update(state, {
  postsGetCache: {
    $resourceCachePushRequest: {
      ...action,
      resourceKey: action.payload.userId,
      initialState: initialState.postsGet,
    },
  },
})

const postsGetMoreSuccess = (state, action) => update(state, {
  postsGetCache: {
    $postsResourceCachePushSuccess: {
      ...action,
      resourceKey: action.payload.payload.userId,
      initialState: initialState.postsGet,
    },
  },
})

/**
 *
 */
const postsGetUnreadCommentsRequest = (state, action) => update(state, {
  postsGetUnreadComments: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsGetUnreadCommentsSuccess = (state, action) => update(state, {
  postsGetUnreadComments: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    payload: { $set: action.payload.payload },
    meta: { $set: action.payload.meta },
  },
})

const postsGetUnreadCommentsFailure = (state) => update(state, {
  postsGetUnreadComments: {
    status: { $set: 'failure' },
  },
})

const postsGetUnreadCommentsIdle = (state, action) => update(state, {
  postsGetUnreadComments: {
    status: { $set: 'idle' },
    payload: { $set: action.payload.payload },
  },
})


/**
 *
 */
const postsViewsGetRequest = (state, action) => update(state, {
  postsViewsGetCache: {
    $resourceCacheSetRequest: {
      ...action,
      resourceKey: action.payload.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

const postsViewsGetSuccess = (state, action) => update(state, {
  postsViewsGetCache: {
    $resourceCacheSetSuccess: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

const postsViewsGetFailure = (state, action) => update(state, {
  postsViewsGetCache: {
    $resourceCacheSetFailure: {
      ...action,
      resourceKey: action.meta.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

const postsViewsGetIdle = (state, action) => update(state, {
  postsViewsGetCache: {
    $resourceCacheSetIdle: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

const postsViewsGetMoreRequest = (state, action) => update(state, {
  postsViewsGetCache: {
    $resourceCachePushRequest: {
      ...action,
      resourceKey: action.payload.postId,
      initialState: initialState.postsGet,
    },
  },
})

const postsViewsGetMoreSuccess = (state, action) => update(state, {
  postsViewsGetCache: {
    $postsResourceCachePushSuccess: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})


/**
 *
 */
const postsLikesGetRequest = (state, action) => update(state, {
  postsLikesGetCache: {
    $resourceCacheSetRequest: {
      ...action,
      resourceKey: action.payload.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

const postsLikesGetSuccess = (state, action) => update(state, {
  postsLikesGetCache: {
    $resourceCacheSetSuccess: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsLikesGet,
    },
  },
})

const postsLikesGetFailure = (state, action) => update(state, {
  postsLikesGetCache: {
    $resourceCacheSetFailure: {
      ...action,
      resourceKey: action.meta.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

const postsLikesGetIdle = (state, action) => update(state, {
  postsLikesGetIdle: {
    $resourceCacheSetIdle: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsViewsGet,
    },
  },
})

/**
 *
 */
const postsGetArchivedRequest = (state, action) => update(state, {
  postsGetArchived: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsGetArchivedSuccess = (state, action) => update(state, {
  postsGetArchived: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsGetArchivedFailure = (state) => update(state, {
  postsGetArchived: {
    status: { $set: 'failure' },
  },
})

const postsGetArchivedIdle = (state) => update(state, {
  postsGetArchived: {
    data: { $set: initialState.postsGetArchived.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsEditRequest = (state, action) => update(state, {
  postsEdit: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsEditSuccess = (state, action) => update(state, {
  postsEdit: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsEditFailure = (state) => update(state, {
  postsEdit: {
    status: { $set: 'failure' },
  },
})

const postsEditIdle = (state) => update(state, {
  postsEdit: {
    data: { $set: initialState.postsEdit.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsDeleteRequest = (state, action) => update(state, {
  postsDelete: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsDeleteSuccess = (state, action) => update(state, {
  postsDelete: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },

  /**
   *
   */
  postsFeedGet: {
    data: { $postsResourceRemoveSuccess: action },
  },
})

const postsDeleteFailure = (state) => update(state, {
  postsDelete: {
    status: { $set: 'failure' },
  },
})

const postsDeleteIdle = (state) => update(state, {
  postsDelete: {
    data: { $set: initialState.postsDelete.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsArchiveRequest = (state, action) => update(state, {
  postsArchive: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsArchiveSuccess = (state, action) => update(state, {
  postsArchive: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },

  /**
   *
   */
  postsFeedGet: {
    data: { $postsResourceRemoveSuccess: action },
  },
})

const postsArchiveFailure = (state) => update(state, {
  postsArchive: {
    status: { $set: 'failure' },
  },
})

const postsArchiveIdle = (state) => update(state, {
  postsArchive: {
    data: { $set: initialState.postsArchive.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsRestoreArchivedRequest = (state, action) => update(state, {
  postsRestoreArchived: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsRestoreArchivedSuccess = (state, action) => update(state, {
  postsRestoreArchived: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },

  postsGetArchived: {
    data: { $postsResourceRemoveSuccess: action },
  },
})

const postsRestoreArchivedFailure = (state) => update(state, {
  postsRestoreArchived: {
    status: { $set: 'failure' },
  },
})

const postsRestoreArchivedIdle = (state) => update(state, {
  postsRestoreArchived: {
    data: { $set: initialState.postsRestoreArchived.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsFlagRequest = (state, action) => update(state, {
  postsFlag: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsFlagSuccess = (state, action) => update(state, {
  postsFlag: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsFlagFailure = (state) => update(state, {
  postsFlag: {
    status: { $set: 'failure' },
  },
})

const postsFlagIdle = (state) => update(state, {
  postsFlag: {
    data: { $set: initialState.postsFlag.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsSingleGetRequest = (state, action) => update(state, {
  postsSingleGet: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsSingleGetSuccess = (state, action) => update(state, {
  postsSingleGet: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsSingleGetFailure = (state) => update(state, {
  postsSingleGet: {
    status: { $set: 'failure' },
  },
})

const postsSingleGetIdle = (state) => update(state, {
  postsSingleGet: {
    data: { $set: initialState.postsSingleGet.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsFeedGetRequest = (state, action) => update(state, {
  postsFeedGet: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
    meta: { $set: action.meta },
  },
})

const postsFeedGetSuccess = (state, action) => update(state, {
  postsFeedGet: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    meta: { $set: action.payload.meta },
  },
})

const postsFeedGetFailure = (state) => update(state, {
  postsFeedGet: {
    status: { $set: 'failure' },
  },
})

const postsFeedGetIdle = (state) => update(state, {
  postsFeedGet: {
    data: { $set: initialState.postsFeedGet.data },
    status: { $set: 'idle' },
  },
})

const postsFeedGetMoreRequest = (state, action) => update(state, {
  postsFeedGet: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
    meta: { $set: action.meta },
  },
})

const postsFeedGetMoreSuccess = (state, action) => update(state, {
  postsFeedGet: {
    data: { $push: action.payload.data },
    status: { $set: 'success' },
    meta: { $set: action.payload.meta },
  },
})

/**
 *
 */
const postsCreateRequest = (state, action) => update(state, {
  postsCreate: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },

  /**
   *
   */
  postsCreateQueue: {
    $resourceCacheSetRequest: {
      ...action,
      resourceKey: action.payload.postId,
      initialState: initialState.postsCreate,
    },
  },
})

const postsCreateSuccess = (state, action) => update(state, {
  postsCreate: {
    data: { $set: action.payload.data },
    payload: { $set: action.payload.payload },
    status: { $set: 'success' },
  },

  /**
   *
   */
  postsCreateQueue: {
    $resourceCacheSetSuccess: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsCreate,
    },
  },
})

const postsCreateFailure = (state, action) => update(state, {
  postsCreate: {
    status: { $set: 'failure' },
  },

  /**
   *
   */
  postsCreateQueue: {
    $resourceCacheSetFailure: {
      ...action,
      resourceKey: action.meta.postId,
      initialState: initialState.postsCreate,
    },
  },
})

const postsCreateIdle = (state, action) => update(state, {
  postsCreate: {
    data: { $set: initialState.postsCreate.data },
    status: { $set: 'idle' },
  },

  /**
   *
   */
  postsCreateQueue: {
    $resourceCacheSetRemove: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsCreate,
    },
  },
})

const postsCreateProgress = (state, action) => update(state, {
  postsCreate: {
    status: { $set: 'loading' },
    meta: { $set: action.payload.meta },
  },

  /**
   *
   */
  postsCreateQueue: {
    $resourceCacheAlterRequest: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsCreate,
    },
  },
})

/**
 *
 */
const postsOnymouslyLikeRequest = (state, action) => update(state, {
  postsOnymouslyLike: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsOnymouslyLikeSuccess = (state, action) => update(state, {
  postsOnymouslyLike: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsOnymouslyLikeFailure = (state) => update(state, {
  postsOnymouslyLike: {
    status: { $set: 'failure' },
  },
})

const postsOnymouslyLikeIdle = (state) => update(state, {
  postsOnymouslyLike: {
    data: { $set: initialState.postsOnymouslyLike.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsDislikeRequest = (state, action) => update(state, {
  postsDislike: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsDislikeSuccess = (state, action) => update(state, {
  postsDislike: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsDislikeFailure = (state) => update(state, {
  postsDislike: {
    status: { $set: 'failure' },
  },
})

const postsDislikeIdle = (state) => update(state, {
  postsDislike: {
    data: { $set: initialState.postsDislike.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsShareRequest = (state, action) => update(state, {
  postsShare: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsShareSuccess = (state, action) => update(state, {
  postsShare: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsShareFailure = (state) => update(state, {
  postsShare: {
    status: { $set: 'failure' },
  },
})

const postsShareIdle = (state) => update(state, {
  postsShare: {
    data: { $set: initialState.postsShare.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsReportPostViewsRequest = (state, action) => update(state, {
  postsReportPostViews: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsReportPostViewsSuccess = (state, action) => update(state, {
  postsReportPostViews: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const postsReportPostViewsFailure = (state) => update(state, {
  postsReportPostViews: {
    status: { $set: 'failure' },
  },
})

const postsReportPostViewsIdle = (state) => update(state, {
  postsReportPostViews: {
    data: { $set: initialState.postsReportPostViews.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsGetTrendingPostsRequest = (state, action) => update(state, {
  postsGetTrendingPosts: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
    meta: { $set: initialState.postsGetTrendingPosts.meta },
  },
})

const postsGetTrendingPostsSuccess = (state, action) => update(state, {
  postsGetTrendingPosts: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    meta: { $set: action.payload.meta },
  },
})

const postsGetTrendingPostsFailure = (state) => update(state, {
  postsGetTrendingPosts: {
    status: { $set: 'failure' },
  },
})

const postsGetTrendingPostsChangeFilters = (state, action) => update(state, {
  postsGetTrendingPosts: {
    filters: { $set: action.payload },
  },
})

const postsGetTrendingPostsMoreRequest = (state, action) => update(state, {
  postsGetTrendingPosts: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
    meta: { $set: action.meta },
  },
})

const postsGetTrendingPostsMoreSuccess = (state, action) => update(state, {
  postsGetTrendingPosts: {
    data: { $push: action.payload.data },
    status: { $set: 'success' },
    payload: { $set: action.payload.payload },
    meta: { $set: action.payload.meta },
  },
})

/**
 *
 */
const postsCommentsGetRequest = (state, action) => update(state, {
  postsCommentsGetCache: {
    $resourceCacheSetRequest: {
      ...action,
      resourceKey: action.payload.postId,
      initialState: initialState.postsGet,
    },
  },
})

const postsCommentsGetSuccess = (state, action) => update(state, {
  postsCommentsGetCache: {
    $resourceCacheSetSuccess: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsCommentsGet,
    },
  },
})

const postsCommentsGetFailure = (state, action) => update(state, {
  postsCommentsGetCache: {
    $resourceCacheSetFailure: {
      ...action,
      resourceKey: action.meta.postId,
      initialState: initialState.postsCommentsGet,
    },
  },
})

const postsCommentsGetIdle = (state, action) => update(state, {
  postsCommentsGetCache: {
    $resourceCacheSetIdle: {
      ...action,
      resourceKey: action.payload.payload.postId,
      initialState: initialState.postsCommentsGet,
    },
  },
})

/**
 *
 */
const commentsAddRequest = (state, action) => update(state, {
  commentsAdd: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const commentsAddSuccess = (state, action) => update(state, {
  commentsAdd: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const commentsAddFailure = (state) => update(state, {
  commentsAdd: {
    status: { $set: 'failure' },
  },
})

const commentsAddIdle = (state) => update(state, {
  commentsAdd: {
    data: { $set: initialState.commentsAdd.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const commentsDeleteRequest = (state, action) => update(state, {
  commentsDelete: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const commentsDeleteSuccess = (state, action) => update(state, {
  commentsDelete: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const commentsDeleteFailure = (state) => update(state, {
  commentsDelete: {
    status: { $set: 'failure' },
  },
})

const commentsDeleteIdle = (state) => update(state, {
  commentsDelete: {
    data: { $set: initialState.commentsDelete.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const commentsFlagRequest = (state, action) => update(state, {
  commentsFlag: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const commentsFlagSuccess = (state, action) => update(state, {
  commentsFlag: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
  },
})

const commentsFlagFailure = (state) => update(state, {
  commentsFlag: {
    status: { $set: 'failure' },
  },
})

const commentsFlagIdle = (state) => update(state, {
  commentsFlag: {
    data: { $set: initialState.commentsFlag.data },
    status: { $set: 'idle' },
  },
})

/**
 *
 */
const postsSimilarRequest = (state, action) => update(state, {
  postsSimilar: {
    status: { $set: 'loading' },
    payload: { $set: action.payload },
  },
})

const postsSimilarSuccess = (state, action) => update(state, {
  postsSimilar: {
    data: { $set: action.payload.data },
    status: { $set: 'success' },
    meta: { $set: action.payload.meta },
  },
})

const postsSimilarFailure = (state) => update(state, {
  postsSimilar: {
    status: { $set: 'failure' },
  },
})

const postsSimilarIdle = (state) => update(state, {
  postsSimilar: {
    $set: initialState.postsSimilar,
  },
})

/**
 *
 */
const postsSimilarMoreRequest = (state) => update(state, {
  postsSimilar: {
    status: { $set: 'loading' },
  },
})

const postsSimilarMoreSuccess = (state, action) => update(state, {
  postsSimilar: {
    data: { $push: action.payload.data },
    status: { $set: 'success' },
    meta: { $set: action.payload.meta },
  },
})

const postsSimilarMoreFailure = (state) => update(state, {
  postsSimilar: {
    status: { $set: 'failure' },
  },
})

export default handleActions({
  [constants.POSTS_GET_REQUEST]: postsGetRequest,
  [constants.POSTS_GET_SUCCESS]: postsGetSuccess,
  [constants.POSTS_GET_FAILURE]: postsGetFailure,
  [constants.POSTS_GET_IDLE]: postsGetIdle,
  [constants.POSTS_GET_MORE_REQUEST]: postsGetMoreRequest,
  [constants.POSTS_GET_MORE_SUCCESS]: postsGetMoreSuccess,

  [constants.POSTS_VIEWS_GET_REQUEST]: postsViewsGetRequest,
  [constants.POSTS_VIEWS_GET_SUCCESS]: postsViewsGetSuccess,
  [constants.POSTS_VIEWS_GET_FAILURE]: postsViewsGetFailure,
  [constants.POSTS_VIEWS_GET_IDLE]: postsViewsGetIdle,
  [constants.POSTS_VIEWS_GET_MORE_REQUEST]: postsViewsGetMoreRequest,
  [constants.POSTS_VIEWS_GET_MORE_SUCCESS]: postsViewsGetMoreSuccess,

  [constants.POSTS_GET_UNREAD_COMMENTS_REQUEST]: postsGetUnreadCommentsRequest,
  [constants.POSTS_GET_UNREAD_COMMENTS_SUCCESS]: postsGetUnreadCommentsSuccess,
  [constants.POSTS_GET_UNREAD_COMMENTS_FAILURE]: postsGetUnreadCommentsFailure,
  [constants.POSTS_GET_UNREAD_COMMENTS_IDLE]: postsGetUnreadCommentsIdle,

  [constants.POSTS_LIKES_GET_REQUEST]: postsLikesGetRequest,
  [constants.POSTS_LIKES_GET_SUCCESS]: postsLikesGetSuccess,
  [constants.POSTS_LIKES_GET_FAILURE]: postsLikesGetFailure,
  [constants.POSTS_LIKES_GET_IDLE]: postsLikesGetIdle,

  [constants.POSTS_GET_ARCHIVED_REQUEST]: postsGetArchivedRequest,
  [constants.POSTS_GET_ARCHIVED_SUCCESS]: postsGetArchivedSuccess,
  [constants.POSTS_GET_ARCHIVED_FAILURE]: postsGetArchivedFailure,
  [constants.POSTS_GET_ARCHIVED_IDLE]: postsGetArchivedIdle,

  [constants.POSTS_EDIT_REQUEST]: postsEditRequest,
  [constants.POSTS_EDIT_SUCCESS]: postsEditSuccess,
  [constants.POSTS_EDIT_FAILURE]: postsEditFailure,
  [constants.POSTS_EDIT_IDLE]: postsEditIdle,

  [constants.POSTS_DELETE_REQUEST]: postsDeleteRequest,
  [constants.POSTS_DELETE_SUCCESS]: postsDeleteSuccess,
  [constants.POSTS_DELETE_FAILURE]: postsDeleteFailure,
  [constants.POSTS_DELETE_IDLE]: postsDeleteIdle,

  [constants.POSTS_ARCHIVE_REQUEST]: postsArchiveRequest,
  [constants.POSTS_ARCHIVE_SUCCESS]: postsArchiveSuccess,
  [constants.POSTS_ARCHIVE_FAILURE]: postsArchiveFailure,
  [constants.POSTS_ARCHIVE_IDLE]: postsArchiveIdle,

  [constants.POSTS_RESTORE_ARCHIVED_REQUEST]: postsRestoreArchivedRequest,
  [constants.POSTS_RESTORE_ARCHIVED_SUCCESS]: postsRestoreArchivedSuccess,
  [constants.POSTS_RESTORE_ARCHIVED_FAILURE]: postsRestoreArchivedFailure,
  [constants.POSTS_RESTORE_ARCHIVED_IDLE]: postsRestoreArchivedIdle,

  [constants.POSTS_FLAG_REQUEST]: postsFlagRequest,
  [constants.POSTS_FLAG_SUCCESS]: postsFlagSuccess,
  [constants.POSTS_FLAG_FAILURE]: postsFlagFailure,
  [constants.POSTS_FLAG_IDLE]: postsFlagIdle,

  [constants.POSTS_SINGLE_GET_REQUEST]: postsSingleGetRequest,
  [constants.POSTS_SINGLE_GET_SUCCESS]: postsSingleGetSuccess,
  [constants.POSTS_SINGLE_GET_FAILURE]: postsSingleGetFailure,
  [constants.POSTS_SINGLE_GET_IDLE]: postsSingleGetIdle,

  [constants.POSTS_FEED_GET_REQUEST]: postsFeedGetRequest,
  [constants.POSTS_FEED_GET_SUCCESS]: postsFeedGetSuccess,
  [constants.POSTS_FEED_GET_FAILURE]: postsFeedGetFailure,
  [constants.POSTS_FEED_GET_IDLE]: postsFeedGetIdle,
  [constants.POSTS_FEED_GET_MORE_REQUEST]: postsFeedGetMoreRequest,
  [constants.POSTS_FEED_GET_MORE_SUCCESS]: postsFeedGetMoreSuccess,

  [constants.POSTS_CREATE_REQUEST]: postsCreateRequest,
  [constants.POSTS_CREATE_SUCCESS]: postsCreateSuccess,
  [constants.POSTS_CREATE_FAILURE]: postsCreateFailure,
  [constants.POSTS_CREATE_IDLE]: postsCreateIdle,
  [constants.POSTS_CREATE_PROGRESS]: postsCreateProgress,

  [constants.POSTS_ONYMOUSLY_LIKE_REQUEST]: postsOnymouslyLikeRequest,
  [constants.POSTS_ONYMOUSLY_LIKE_SUCCESS]: postsOnymouslyLikeSuccess,
  [constants.POSTS_ONYMOUSLY_LIKE_FAILURE]: postsOnymouslyLikeFailure,
  [constants.POSTS_ONYMOUSLY_LIKE_IDLE]: postsOnymouslyLikeIdle,

  [constants.POSTS_DISLIKE_REQUEST]: postsDislikeRequest,
  [constants.POSTS_DISLIKE_SUCCESS]: postsDislikeSuccess,
  [constants.POSTS_DISLIKE_FAILURE]: postsDislikeFailure,
  [constants.POSTS_DISLIKE_IDLE]: postsDislikeIdle,

  [constants.POSTS_SHARE_REQUEST]: postsShareRequest,
  [constants.POSTS_SHARE_SUCCESS]: postsShareSuccess,
  [constants.POSTS_SHARE_FAILURE]: postsShareFailure,
  [constants.POSTS_SHARE_IDLE]: postsShareIdle,

  [constants.POSTS_REPORT_POST_VIEWS_REQUEST]: postsReportPostViewsRequest,
  [constants.POSTS_REPORT_POST_VIEWS_SUCCESS]: postsReportPostViewsSuccess,
  [constants.POSTS_REPORT_POST_VIEWS_FAILURE]: postsReportPostViewsFailure,
  [constants.POSTS_REPORT_POST_VIEWS_IDLE]: postsReportPostViewsIdle,

  [constants.POSTS_GET_TRENDING_POSTS_REQUEST]: postsGetTrendingPostsRequest,
  [constants.POSTS_GET_TRENDING_POSTS_SUCCESS]: postsGetTrendingPostsSuccess,
  [constants.POSTS_GET_TRENDING_POSTS_FAILURE]: postsGetTrendingPostsFailure,
  [constants.POSTS_GET_TRENDING_POSTS_CHANGE_FILTERS]: postsGetTrendingPostsChangeFilters,
  [constants.POSTS_GET_TRENDING_POSTS_MORE_REQUEST]: postsGetTrendingPostsMoreRequest,
  [constants.POSTS_GET_TRENDING_POSTS_MORE_SUCCESS]: postsGetTrendingPostsMoreSuccess,

  [constants.POSTS_COMMENTS_GET_REQUEST]: postsCommentsGetRequest,
  [constants.POSTS_COMMENTS_GET_SUCCESS]: postsCommentsGetSuccess,
  [constants.POSTS_COMMENTS_GET_FAILURE]: postsCommentsGetFailure,
  [constants.POSTS_COMMENTS_GET_IDLE]: postsCommentsGetIdle,

  [constants.COMMENTS_ADD_REQUEST]: commentsAddRequest,
  [constants.COMMENTS_ADD_SUCCESS]: commentsAddSuccess,
  [constants.COMMENTS_ADD_FAILURE]: commentsAddFailure,
  [constants.COMMENTS_ADD_IDLE]: commentsAddIdle,

  [constants.COMMENTS_DELETE_REQUEST]: commentsDeleteRequest,
  [constants.COMMENTS_DELETE_SUCCESS]: commentsDeleteSuccess,
  [constants.COMMENTS_DELETE_FAILURE]: commentsDeleteFailure,
  [constants.COMMENTS_DELETE_IDLE]: commentsDeleteIdle,

  [constants.COMMENTS_FLAG_REQUEST]: commentsFlagRequest,
  [constants.COMMENTS_FLAG_SUCCESS]: commentsFlagSuccess,
  [constants.COMMENTS_FLAG_FAILURE]: commentsFlagFailure,
  [constants.COMMENTS_FLAG_IDLE]: commentsFlagIdle,

  [constants.POSTS_SIMILAR_IDLE]: postsSimilarIdle,
  [constants.POSTS_SIMILAR_REQUEST]: postsSimilarRequest,
  [constants.POSTS_SIMILAR_SUCCESS]: postsSimilarSuccess,
  [constants.POSTS_SIMILAR_FAILURE]: postsSimilarFailure,

  [constants.POSTS_SIMILAR_MORE_REQUEST]: postsSimilarMoreRequest,
  [constants.POSTS_SIMILAR_MORE_SUCCESS]: postsSimilarMoreSuccess,
  [constants.POSTS_SIMILAR_MORE_FAILURE]: postsSimilarMoreFailure,
}, initialState)
