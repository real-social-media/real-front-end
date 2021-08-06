import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import PostComponent from 'components/Post'
import NativeError from 'templates/NativeError'
import { withTranslation } from 'react-i18next'

const PostMedia = ({
  t,
  user,
  postsArchiveRequest,
  postsRestoreArchivedRequest,
  postsFlag,
  postsFlagRequest,
  postsDeleteRequest,
  changeAvatarRequest,
  postsOnymouslyLikeRequest,
  postsDislikeRequest,
  postsSingleGet,
  actionSheetRefs,
  textPostRefs,
  postsSingleGetRequest,
}) => {
  const post = postsSingleGet.data

  const createActionSheetRef = useCallback(element => actionSheetRefs.current[post.postId] = element, [post.postId])
  const createTextPostRef = useCallback(element => textPostRefs.current[post.postId] = element, [post.postId])

  const {
    onViewableItemsFocusRef,
  } = useViewable()

  /**
   * Simulate behaviour from FlatList of onViewableItemsChanged to trigger post views
   */
  useEffect(() => {
    if (post.postId) {
      onViewableItemsFocusRef.current({ viewableItems: [{ item: post }] })
    }
  }, [post.postId])

  /**
   * This will be a very rare case since post will be already in the normalized
   * entities state by the time we navigate to it, only use case might be when
   * navigating to the post with deeplink
   */
  if (!post.postId) return null

  return (
    <ScrollView
      style={styling.root}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.border}
          onRefresh={postsSingleGetRequest}
          refreshing={postsSingleGet.status === 'loading'}
        />
      }
    >
      <NativeError
        handleCancelPress={() => {}}
        titleText={t('All good!')}
        messageText={t('This post has been flagged as inappropriate')}
        actionText={t('Done')}
        status={postsFlag.status}
        triggerOn="success"
      />
      <PostComponent
        user={user}
        post={post}
        postsArchiveRequest={postsArchiveRequest}
        postsRestoreArchivedRequest={postsRestoreArchivedRequest}
        postsFlagRequest={postsFlagRequest}
        postsDeleteRequest={postsDeleteRequest}
        changeAvatarRequest={changeAvatarRequest}
        postsOnymouslyLikeRequest={postsOnymouslyLikeRequest}
        postsDislikeRequest={postsDislikeRequest}
        priorityIndex={1}
        createActionSheetRef={createActionSheetRef}
        actionSheetRef={actionSheetRefs.current[post.postId]}
        createTextPostRef={createTextPostRef}
        textPostRef={textPostRefs.current[post.postId]}
      />
    </ScrollView>
  )
}

PostMedia.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  user: PropTypes.any,
  postsArchiveRequest: PropTypes.any,
  postsFlag: PropTypes.any,
  postsFlagRequest: PropTypes.any,
  postsDeleteRequest: PropTypes.any,
  changeAvatarRequest: PropTypes.func,
  postsOnymouslyLikeRequest: PropTypes.any,
  postsDislikeRequest: PropTypes.any,
  postsRestoreArchivedRequest: PropTypes.any,
  postsSingleGet: PropTypes.any,
  actionSheetRefs: PropTypes.any,
  textPostRefs: PropTypes.any,
  postsSingleGetRequest: PropTypes.func,
}

export default withTranslation()(PostMedia)
