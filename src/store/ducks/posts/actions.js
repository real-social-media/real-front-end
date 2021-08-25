import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'
import { createActionWithMeta } from 'store/helpers'
import * as constants from 'store/ducks/posts/constants'

/**
 *
 */
export const postsGetIdle = createAction(constants.POSTS_GET_IDLE)
export const postsGetRequest = createAction(constants.POSTS_GET_REQUEST)
export const postsGetSuccess = createAction(constants.POSTS_GET_SUCCESS)
export const postsGetFailure = createFailureAction(constants.POSTS_GET_FAILURE)

export const postsGetMoreIdle = createAction(constants.POSTS_GET_MORE_IDLE)
export const postsGetMoreRequest = createAction(constants.POSTS_GET_MORE_REQUEST)
export const postsGetMoreSuccess = createAction(constants.POSTS_GET_MORE_SUCCESS)
export const postsGetMoreFailure = createFailureAction(constants.POSTS_GET_MORE_FAILURE)

export const postsGetUnreadCommentsIdle = createAction(constants.POSTS_GET_UNREAD_COMMENTS_IDLE)
export const postsGetUnreadCommentsRequest = createAction(constants.POSTS_GET_UNREAD_COMMENTS_REQUEST)
export const postsGetUnreadCommentsSuccess = createAction(constants.POSTS_GET_UNREAD_COMMENTS_SUCCESS)
export const postsGetUnreadCommentsFailure = createFailureAction(constants.POSTS_GET_UNREAD_COMMENTS_FAILURE)

export const postsViewsGetIdle = createAction(constants.POSTS_VIEWS_GET_IDLE)
export const postsViewsGetRequest = createAction(constants.POSTS_VIEWS_GET_REQUEST)
export const postsViewsGetSuccess = createAction(constants.POSTS_VIEWS_GET_SUCCESS)
export const postsViewsGetFailure = createFailureAction(constants.POSTS_VIEWS_GET_FAILURE)

export const postsViewsGetMoreIdle = createAction(constants.POSTS_VIEWS_GET_MORE_IDLE)
export const postsViewsGetMoreRequest = createAction(constants.POSTS_VIEWS_GET_MORE_REQUEST)
export const postsViewsGetMoreSuccess = createAction(constants.POSTS_VIEWS_GET_MORE_SUCCESS)
export const postsViewsGetMoreFailure = createFailureAction(constants.POSTS_VIEWS_GET_MORE_FAILURE)

export const postsLikesGetIdle = createAction(constants.POSTS_LIKES_GET_IDLE)
export const postsLikesGetRequest = createAction(constants.POSTS_LIKES_GET_REQUEST)
export const postsLikesGetSuccess = createAction(constants.POSTS_LIKES_GET_SUCCESS)
export const postsLikesGetFailure = createFailureAction(constants.POSTS_LIKES_GET_FAILURE)

/**
 *
 */
export const postsFeedGetIdle = createAction(constants.POSTS_FEED_GET_IDLE)
export const postsFeedGetRequest = createAction(constants.POSTS_FEED_GET_REQUEST)
export const postsFeedGetSuccess = createAction(constants.POSTS_FEED_GET_SUCCESS)
export const postsFeedGetFailure = createFailureAction(constants.POSTS_FEED_GET_FAILURE)

export const postsFeedGetMoreIdle = createAction(constants.POSTS_FEED_GET_MORE_IDLE)
export const postsFeedGetMoreRequest = createAction(constants.POSTS_FEED_GET_MORE_REQUEST)
export const postsFeedGetMoreSuccess = createAction(constants.POSTS_FEED_GET_MORE_SUCCESS)
export const postsFeedGetMoreFailure = createFailureAction(constants.POSTS_FEED_GET_MORE_FAILURE)

/**
 *
 */
export const postsGetArchivedIdle = createAction(constants.POSTS_GET_ARCHIVED_IDLE)
export const postsGetArchivedRequest = createAction(constants.POSTS_GET_ARCHIVED_REQUEST)
export const postsGetArchivedSuccess = createAction(constants.POSTS_GET_ARCHIVED_SUCCESS)
export const postsGetArchivedFailure = createFailureAction(constants.POSTS_GET_ARCHIVED_FAILURE)

/**
 *
 */
export const postsEditIdle = createAction(constants.POSTS_EDIT_IDLE)
export const postsEditRequest = createAction(constants.POSTS_EDIT_REQUEST)
export const postsEditSuccess = createAction(constants.POSTS_EDIT_SUCCESS)
export const postsEditFailure = createFailureAction(constants.POSTS_EDIT_FAILURE)

/**
 *
 */
export const postsDeleteIdle = createAction(constants.POSTS_DELETE_IDLE)
export const postsDeleteRequest = createAction(constants.POSTS_DELETE_REQUEST)
export const postsDeleteSuccess = createAction(constants.POSTS_DELETE_SUCCESS)
export const postsDeleteFailure = createFailureAction(constants.POSTS_DELETE_FAILURE)

/**
 *
 */
export const postsArchiveIdle = createAction(constants.POSTS_ARCHIVE_IDLE)
export const postsArchiveRequest = createAction(constants.POSTS_ARCHIVE_REQUEST)
export const postsArchiveSuccess = createAction(constants.POSTS_ARCHIVE_SUCCESS)
export const postsArchiveFailure = createFailureAction(constants.POSTS_ARCHIVE_FAILURE)

/**
 *
 */
export const postsRestoreArchivedIdle = createAction(constants.POSTS_RESTORE_ARCHIVED_IDLE)
export const postsRestoreArchivedRequest = createAction(constants.POSTS_RESTORE_ARCHIVED_REQUEST)
export const postsRestoreArchivedSuccess = createAction(constants.POSTS_RESTORE_ARCHIVED_SUCCESS)
export const postsRestoreArchivedFailure = createFailureAction(constants.POSTS_RESTORE_ARCHIVED_FAILURE)

/**
 *
 */
export const postsFlagIdle = createAction(constants.POSTS_FLAG_IDLE)
export const postsFlagRequest = createAction(constants.POSTS_FLAG_REQUEST)
export const postsFlagSuccess = createAction(constants.POSTS_FLAG_SUCCESS)
export const postsFlagFailure = createFailureAction(constants.POSTS_FLAG_FAILURE)

/**
 *
 */
export const postsSingleGetIdle = createAction(constants.POSTS_SINGLE_GET_IDLE)
export const postsSingleGetRequest = createAction(constants.POSTS_SINGLE_GET_REQUEST)
export const postsSingleGetSuccess = createAction(constants.POSTS_SINGLE_GET_SUCCESS)
export const postsSingleGetFailure = createFailureAction(constants.POSTS_SINGLE_GET_FAILURE)

/**
 *
 */
export const postsShareIdle = createAction(constants.POSTS_SHARE_IDLE)
export const postsShareRequest = createAction(constants.POSTS_SHARE_REQUEST)
export const postsShareSuccess = createAction(constants.POSTS_SHARE_SUCCESS)
export const postsShareFailure = createFailureAction(constants.POSTS_SHARE_FAILURE)

/**
 *
 */
export const postsCreateIdle = createAction(constants.POSTS_CREATE_IDLE)
export const postsCreateRequest = createActionWithMeta(constants.POSTS_CREATE_REQUEST)
export const postsCreateSuccess = createActionWithMeta(constants.POSTS_CREATE_SUCCESS)
export const postsCreateFailure = createFailureAction(constants.POSTS_CREATE_FAILURE)
export const postsCreateProgress = createAction(constants.POSTS_CREATE_PROGRESS)

/**
 *
 */
export const postsOnymouslyLikeIdle = createAction(constants.POSTS_ONYMOUSLY_LIKE_IDLE)
export const postsOnymouslyLikeRequest = createAction(constants.POSTS_ONYMOUSLY_LIKE_REQUEST)
export const postsOnymouslyLikeSuccess = createAction(constants.POSTS_ONYMOUSLY_LIKE_SUCCESS)
export const postsOnymouslyLikeFailure = createFailureAction(constants.POSTS_ONYMOUSLY_LIKE_FAILURE)

/**
 *
 */
export const postsDislikeIdle = createAction(constants.POSTS_DISLIKE_IDLE)
export const postsDislikeRequest = createAction(constants.POSTS_DISLIKE_REQUEST)
export const postsDislikeSuccess = createAction(constants.POSTS_DISLIKE_SUCCESS)
export const postsDislikeFailure = createFailureAction(constants.POSTS_DISLIKE_FAILURE)

/**
 *
 */
export const postsReportPostViewsIdle = createAction(constants.POSTS_REPORT_POST_VIEWS_IDLE)
export const postsReportPostViewsRequest = createAction(constants.POSTS_REPORT_POST_VIEWS_REQUEST)
export const postsReportPostViewsSuccess = createAction(constants.POSTS_REPORT_POST_VIEWS_SUCCESS)
export const postsReportPostViewsFailure = createFailureAction(constants.POSTS_REPORT_POST_VIEWS_FAILURE)

/**
 *
 */
export const postsGetTrendingPostsRequest = createAction(constants.POSTS_GET_TRENDING_POSTS_REQUEST)
export const postsGetTrendingPostsSuccess = createAction(constants.POSTS_GET_TRENDING_POSTS_SUCCESS)
export const postsGetTrendingPostsFailure = createFailureAction(constants.POSTS_GET_TRENDING_POSTS_FAILURE)
export const postsGetTrendingPostsChangeFilters = createAction(constants.POSTS_GET_TRENDING_POSTS_CHANGE_FILTERS)

export const postsGetTrendingPostsMoreIdle = createAction(constants.POSTS_GET_TRENDING_POSTS_MORE_IDLE)
export const postsGetTrendingPostsMoreRequest = createAction(constants.POSTS_GET_TRENDING_POSTS_MORE_REQUEST)
export const postsGetTrendingPostsMoreSuccess = createAction(constants.POSTS_GET_TRENDING_POSTS_MORE_SUCCESS)
export const postsGetTrendingPostsMoreFailure = createFailureAction(constants.POSTS_GET_TRENDING_POSTS_MORE_FAILURE)

/**
 *
 */
export const postsCommentsGetIdle = createAction(constants.POSTS_COMMENTS_GET_IDLE)
export const postsCommentsGetRequest = createAction(constants.POSTS_COMMENTS_GET_REQUEST)
export const postsCommentsGetSuccess = createAction(constants.POSTS_COMMENTS_GET_SUCCESS)
export const postsCommentsGetFailure = createFailureAction(constants.POSTS_COMMENTS_GET_FAILURE)

export const commentsAddIdle = createAction(constants.COMMENTS_ADD_IDLE)
export const commentsAddRequest = createAction(constants.COMMENTS_ADD_REQUEST)
export const commentsAddSuccess = createAction(constants.COMMENTS_ADD_SUCCESS)
export const commentsAddFailure = createFailureAction(constants.COMMENTS_ADD_FAILURE)

export const commentsDeleteIdle = createAction(constants.COMMENTS_DELETE_IDLE)
export const commentsDeleteRequest = createAction(constants.COMMENTS_DELETE_REQUEST)
export const commentsDeleteSuccess = createAction(constants.COMMENTS_DELETE_SUCCESS)
export const commentsDeleteFailure = createFailureAction(constants.COMMENTS_DELETE_FAILURE)

export const commentsFlagIdle = createAction(constants.COMMENTS_FLAG_IDLE)
export const commentsFlagRequest = createAction(constants.COMMENTS_FLAG_REQUEST)
export const commentsFlagSuccess = createAction(constants.COMMENTS_FLAG_SUCCESS)
export const commentsFlagFailure = createFailureAction(constants.COMMENTS_FLAG_FAILURE)

/**
 *
 */
export const postsPayRequest = createAction(constants.POSTS_PAY_REQUEST)
export const postsPaySuccess = createAction(constants.POSTS_PAY_SUCCESS)
export const postsPayFailure = createFailureAction(constants.POSTS_PAY_FAILURE)

/**
 *
 */
export const postsByCoinIdle = createAction(constants.POSTS_BY_COIN_GET_IDLE)
export const postsByCoinRequest = createAction(constants.POSTS_BY_COIN_GET_REQUEST)
export const postsByCoinSuccess = createAction(constants.POSTS_BY_COIN_GET_SUCCESS)
export const postsByCoinFailure = createFailureAction(constants.POSTS_BY_COIN_GET_FAILURE)

export const postsByCoinMoreIdle = createAction(constants.POSTS_BY_COIN_GET_MORE_IDLE)
export const postsByCoinMoreRequest = createAction(constants.POSTS_BY_COIN_GET_MORE_REQUEST)
export const postsByCoinMoreSuccess = createAction(constants.POSTS_BY_COIN_GET_MORE_SUCCESS)
export const postsByCoinMoreFailure = createFailureAction(constants.POSTS_BY_COIN_GET_MORE_FAILURE)
