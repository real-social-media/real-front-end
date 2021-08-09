import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, RefreshControl, StyleSheet } from 'react-native'
import Post from 'components/Post'
import NativeError from 'templates/NativeError'
import { withTranslation } from 'react-i18next'
import { withTheme } from 'react-native-paper'
import useViewable from 'services/providers/Viewable'

const PostMedia = ({
  t,
  theme,
  postsFlag,
  postsSingleGet,
  postsSingleGetRequest,
  createActionSheetRef,
  getActionSheetRef,
  createTextPostRef,
  getTextPostRef,
}) => {
  const styling = styles(theme)
  const post = postsSingleGet.data

  const { onViewableItemsFocusRef } = useViewable()

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
      <Post
        post={post}
        priorityIndex={1}
        createActionSheetRef={createActionSheetRef(post)}
        actionSheetRef={getActionSheetRef(post)}
        createTextPostRef={createTextPostRef(post)}
        textPostRef={getTextPostRef(post)}
      />
    </ScrollView>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
  })

PostMedia.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  user: PropTypes.any,
  postsFlag: PropTypes.any,
  postsSingleGet: PropTypes.any,
  actionSheetRefs: PropTypes.any,
  textPostRefs: PropTypes.any,
  postsSingleGetRequest: PropTypes.func,
  createActionSheetRef: PropTypes.any,
  getActionSheetRef: PropTypes.any,
  createTextPostRef: PropTypes.any,
  getTextPostRef: PropTypes.any,
}

export default withTranslation()(withTheme(PostMedia))
