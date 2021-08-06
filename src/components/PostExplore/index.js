import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import PostComponent from 'components/Post'
import PostsGridThumbnailComponent from 'components/PostsGrid/Thumbnail'
import NativeError from 'templates/NativeError'
import useViewable from 'services/providers/Viewable'
import ScrollService from 'services/Scroll'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const PostExplore = ({
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
  postsSimilar,
  postsSingleGetRequest,
  postsSimilarRequest,
  postsSimilarMoreRequest,
  actionSheetRefs,
  textPostRefs,
}) => {
  const styling = styles(theme)
  const post = postsSingleGet.data

  const createActionSheetRef = useCallback(element => actionSheetRefs.current[post.postId] = element, [post.postId])
  const createTextPostRef = useCallback(element => textPostRefs.current[post.postId] = element, [post.postId])

  const scroll = ScrollService({
    resource: postsSimilar,
    loadInit: () => {
      postsSingleGetRequest()
      postsSimilarRequest()
    },
    loadMore: postsSimilarMoreRequest,
  })

  const {
    onViewableItemsThumbnailsRef,
    onViewableItemsFocusRef,
    viewabilityConfigRef,
  } = useViewable()

  /**
   * Simulate behaviour from FlatList of onViewableItemsChanged to trigger post views
   */
  useEffect(() => {
    if (post.postId) {
      onViewableItemsFocusRef.current({ viewableItems: [{ item: post }] })
    }

    scroll.handleRefresh()
  }, [post.postId])

  /**
   * This will be a very rare case since post will be already in the normalized
   * entities state by the time we navigate to it, only use case might be when
   * navigating to the post with deeplink
   */
  if (!post.postId) return null

  const PostHeader = () => (
    <View>
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
    </View>
  )

  return (
    <FlatList
      data={postsSimilar.data}
      numColumns={3}
      keyExtractor={item => item.postId}
      renderItem={({ item: post, index: priorityIndex }) => (
        <PostsGridThumbnailComponent
          post={post}
          priorityIndex={priorityIndex}
          thread="posts/similar"
        />
      )}
      refreshControl={(
        <RefreshControl
          tintColor={theme.colors.border}
          onRefresh={scroll.handleRefresh}
          refreshing={scroll.refreshing}
        />
      )}
      ListHeaderComponent={(
        <PostHeader />
      )}
      ListFooterComponent={(
        <ActivityIndicator
          animating={scroll.loadingmore}
          color={theme.colors.border}
        />
      )}
      ListFooterComponentStyle={styling.activity}
      onEndReached={scroll.handleLoadMore}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={onViewableItemsThumbnailsRef.current}
      viewabilityConfig={viewabilityConfigRef.current}
    />
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
  activity: {
    padding: theme.spacing.base * 2,
  },
})

PostExplore.propTypes = {
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
  postsSingleGetRequest: PropTypes.func,
  postsSimilarRequest: PropTypes.func,
  postsSimilarMoreRequest: PropTypes.func,
  postsSimilar: PropTypes.any,
  actionSheetRefs: PropTypes.any,
  textPostRefs: PropTypes.any,
}

export default withTranslation()(withTheme(PostExplore))
