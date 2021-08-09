import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import Post from 'components/Post'
import NativeError from 'templates/NativeError'
import useViewable from 'services/providers/Viewable'
import ScrollService from 'services/Scroll'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const PostExplore = ({
  t,
  theme,
  postsFlag,
  postsSingleGet,
  postsSimilar,
  postsSingleGetRequest,
  postsSimilarRequest,
  postsSimilarMoreRequest,
  feedRef,
  handleScrollPrev,
  handleScrollNext,
  createActionSheetRef,
  getActionSheetRef,
  createTextPostRef,
  getTextPostRef,
}) => {
  const styling = styles(theme)
  const post = postsSingleGet.data

  const scroll = ScrollService({
    resource: postsSimilar,
    loadInit: () => {
      postsSingleGetRequest()
      postsSimilarRequest()
    },
    loadMore: postsSimilarMoreRequest,
  })

  const { onViewableItemsThumbnailsRef, onViewableItemsFocusRef, viewabilityConfigRef } = useViewable()

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

  const renderItem = ({ item: post, index }) => (
    <Post
      post={post}
      priorityIndex={index}
      handleScrollPrev={handleScrollPrev(index)}
      handleScrollNext={handleScrollNext(index)}
      createActionSheetRef={createActionSheetRef(post)}
      actionSheetRef={getActionSheetRef(post)}
      createTextPostRef={createTextPostRef(post)}
      textPostRef={getTextPostRef(post)}
    />
  )

  const ListHeaderComponent = () => (
    <View>
      <NativeError
        handleCancelPress={() => {}}
        titleText={t('All good!')}
        messageText={t('This post has been flagged as inappropriate')}
        actionText={t('Done')}
        status={postsFlag.status}
        triggerOn="success"
      />
      {renderItem({ item: post, index: 0 })}
    </View>
  )

  return (
    <FlatList
      ref={feedRef}
      data={postsSimilar.data}
      keyExtractor={(item) => item.postId}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.border}
          onRefresh={scroll.handleRefresh}
          refreshing={scroll.refreshing}
        />
      }
      ListHeaderComponent={<ListHeaderComponent />}
      ListFooterComponent={<ActivityIndicator animating={scroll.loadingmore} color={theme.colors.border} />}
      ListFooterComponentStyle={styling.activity}
      onEndReached={scroll.handleLoadMore}
      onEndReachedThreshold={0.5}
      onViewableItemsChanged={onViewableItemsThumbnailsRef.current}
      viewabilityConfig={viewabilityConfigRef.current}
    />
  )
}

const styles = (theme) =>
  StyleSheet.create({
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
  postsFlag: PropTypes.any,
  postsSingleGet: PropTypes.any,
  postsSimilar: PropTypes.any,
  postsSingleGetRequest: PropTypes.func,
  postsSimilarRequest: PropTypes.func,
  postsSimilarMoreRequest: PropTypes.func,
  actionSheetRefs: PropTypes.any,
  textPostRefs: PropTypes.any,
  feedRef: PropTypes.any,
  handleScrollPrev: PropTypes.func,
  handleScrollNext: PropTypes.func,
  createActionSheetRef: PropTypes.any,
  getActionSheetRef: PropTypes.any,
  createTextPostRef: PropTypes.any,
  getTextPostRef: PropTypes.any,
}

export default withTranslation()(withTheme(PostExplore))
