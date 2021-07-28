import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import path from 'ramda/src/path'
import ListHeaderComponent from 'components/Feed/ListHeaderComponent'
import BookmarkComponent from 'components/Feed/Bookmark'
import PostComponent from 'components/Post'
import PostServiceComponent from 'components/Post/index.service'
import Placeholder from 'components/Feed/Placeholder'
import ScrollService from 'services/Scroll'
import useViewable from 'services/providers/Viewable'

import { withTheme } from 'react-native-paper'
import testIDs from './test-ids'

const Feed = ({
  theme,
  postsFeedGet,
  loadInit,
  postsFeedGetMoreRequest,

  handleScrollPrev,
  handleScrollNext,
  postsGetTrendingPosts,

  bookmarkSeparatorIndex,
  feedRef,

  createActionSheetRef,
  getActionSheetRef,
  createTextPostRef,
  getTextPostRef,
}) => {
  const styling = styles(theme)
  const data = path(['data'])(postsFeedGet)
  const isEmpty = postsFeedGet.status === 'success' && data.length === 0

  const scroll = ScrollService({
    resource: postsFeedGet,
    loadInit,
    loadMore: postsFeedGetMoreRequest,
    multiplier: 3,
  })

  const {
    postInView,
    onViewableItemsFocusRef,
    viewabilityConfigRef,
  } = useViewable({
    viewAreaCoveragePercentThreshold: 60,
  })

  const renderBookmark = () => <BookmarkComponent postsGetTrendingPosts={postsGetTrendingPosts} />

  const renderItem = useCallback(
    ({ item: post, index }) => (
      <React.Fragment>
        {bookmarkSeparatorIndex === index ? renderBookmark() : null}

        <PostServiceComponent>
          {(postProps) => (
            <PostComponent
              {...postProps}
              post={post}
              priorityIndex={index}
              handleScrollPrev={handleScrollPrev(index)}
              handleScrollNext={handleScrollNext(index)}
              createActionSheetRef={createActionSheetRef(post)}
              actionSheetRef={getActionSheetRef(post)}
              createTextPostRef={createTextPostRef(post)}
              textPostRef={getTextPostRef(post)}
              feedRef={feedRef}
              autoPlay={postInView === post.postId}
            />
          )}
        </PostServiceComponent>
      </React.Fragment>
    ), [data],
  )

  const renderActivityIndicator = () => <ActivityIndicator accessibilityLabel="Loader" tintColor={theme.colors.border} />
  const renderFooter = () => isEmpty ? null : scroll.loadingmore ? renderActivityIndicator() : renderBookmark()
  const renderLoader = () => scroll.refreshing ? renderActivityIndicator() : null
  const renderEmpty = () =>
    isEmpty ? (
      <View>
        <Placeholder />
        {renderBookmark()}
      </View>
    ) : (
      renderLoader()
    )

  return (
    <View testID={testIDs.root} style={styling.root}>
      <FlatList
        ref={feedRef}
        keyExtractor={(item) => item.postId}
        data={data}
        onEndReached={scroll.handleLoadMore}
        onEndReachedThreshold={15}
        scrollEventThrottle={500}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.border}
            onRefresh={scroll.handleRefresh}
            refreshing={scroll.refreshing}
          />
        }
        onViewableItemsChanged={onViewableItemsFocusRef.current}
        viewabilityConfig={viewabilityConfigRef.current}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={styling.loading}
      />
    </View>
  )
}
const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    loading: {
      paddingVertical: 16,
    },
  })

Feed.defaultProps = {
  postsGet: {},
}

Feed.propTypes = {
  theme: PropTypes.any,
  feedRef: PropTypes.any,
  postsFeedGet: PropTypes.any,
  loadInit: PropTypes.any,
  postsFeedGetMoreRequest: PropTypes.any,
  handleScrollPrev: PropTypes.any,
  handleScrollNext: PropTypes.any,
  postsGetTrendingPosts: PropTypes.any,
  bookmarkSeparatorIndex: PropTypes.any,
  createActionSheetRef: PropTypes.any,
  getActionSheetRef: PropTypes.any,
  createTextPostRef: PropTypes.any,
  getTextPostRef: PropTypes.any,
}

export default withTheme(Feed)
