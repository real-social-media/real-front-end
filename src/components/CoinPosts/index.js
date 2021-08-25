import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import path from 'ramda/src/path'
import PostComponent from 'components/Post'
import PostServiceComponent from 'components/Post/index.service'
import Placeholder from 'components/CoinPosts/Placeholder'
import ScrollService from 'services/Scroll'
import useViewable from 'services/providers/Viewable'
import { withTheme } from 'react-native-paper'

const CoinPosts = ({
  theme,
  postsByCoin,
  loadInit,
  postsByCoinMoreRequest,
  handleScrollPrev,
  handleScrollNext,
  feedRef,
  createActionSheetRef,
  getActionSheetRef,
  createTextPostRef,
  getTextPostRef,
  paymentTicker,
}) => {
  const styling = styles(theme)
  const data = path(['data'])(postsByCoin)
  const isEmpty = postsByCoin.status === 'success' && data.length === 0

  const scroll = ScrollService({
    resource: postsByCoin,
    loadInit,
    loadMore: postsByCoinMoreRequest,
    multiplier: 3,
    extra: { paymentTicker },
  })

  const { onViewableItemsFocusRef, viewabilityConfigRef } = useViewable()

  const renderItem = useCallback(
    ({ item: post, index }) => (
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
          />
        )}
      </PostServiceComponent>
    ),
    [data],
  )

  const renderActivityIndicator = useCallback(
    () => <ActivityIndicator accessibilityLabel="Loader" tintColor={theme.colors.border} />,
    [],
  )

  const renderFooter = useCallback(() => (isEmpty ? null : scroll.loadingmore ? renderActivityIndicator() : null), [
    isEmpty,
    scroll.loadingmore,
  ])

  const renderLoader = useCallback(() => (scroll.refreshing ? renderActivityIndicator() : null), [scroll.refreshing])

  const renderEmpty = useCallback(() => (isEmpty ? <Placeholder /> : renderLoader()), [isEmpty, scroll.refreshing])

  return (
    <View style={styling.root}>
      <FlatList
        contentContainerStyle={isEmpty ? styling.list : null}
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
    list: {
      flex: 1,
    },
    loading: {
      paddingVertical: 16,
    },
  })

CoinPosts.defaultProps = {
  postsGet: {},
}

CoinPosts.propTypes = {
  theme: PropTypes.any,
  feedRef: PropTypes.any,
  postsByCoin: PropTypes.any,
  loadInit: PropTypes.any,
  postsByCoinMoreRequest: PropTypes.any,
  handleScrollPrev: PropTypes.any,
  handleScrollNext: PropTypes.any,
  bookmarkSeparatorIndex: PropTypes.any,
  createActionSheetRef: PropTypes.any,
  getActionSheetRef: PropTypes.any,
  createTextPostRef: PropTypes.any,
  getTextPostRef: PropTypes.any,
  paymentTicker: PropTypes.string,
}

export default withTheme(CoinPosts)
