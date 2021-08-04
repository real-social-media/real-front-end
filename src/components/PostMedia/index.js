import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native'
import PostComponent from 'components/Post'
import NativeError from 'templates/NativeError'
import useViewable from 'services/providers/Viewable'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const PostMedia = ({
  t,
  theme,
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
}) => {
  const styling = styles(theme)
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

        handleScrollPrev={null}
        handleScrollNext={null}

        createActionSheetRef={createActionSheetRef}
        actionSheetRef={actionSheetRefs.current[post.postId]}
        createTextPostRef={createTextPostRef}
        textPostRef={textPostRefs.current[post.postId]}
      />
    </ScrollView>
  )
}
const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  uploading: {
    flexWrap: 'wrap',
  },
})

PostMedia.defaultProps = {
  postsGet: {},
}

PostMedia.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.any,
  postsArchiveRequest: PropTypes.any,
  postsFlag: PropTypes.any,
  postsFlagRequest: PropTypes.any,
  postsDeleteRequest: PropTypes.any,
  changeAvatarRequest: PropTypes.func,
  postsOnymouslyLikeRequest: PropTypes.any,
  postsDislikeRequest: PropTypes.any,
  t: PropTypes.any,
  postsRestoreArchivedRequest: PropTypes.any,
  postsSingleGet: PropTypes.any,
  actionSheetRefs: PropTypes.any,
  textPostRefs: PropTypes.any,
}

export default withTranslation()(withTheme(PostMedia))
