import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import HeaderComponent from 'components/Search/Header'
import FormComponent from 'components/Search/Form'
import UsersList from 'components/UsersList'
import PostsGridThumbnailComponent from 'components/PostsGrid/Thumbnail'
import { Subheading } from 'react-native-paper'
import path from 'ramda/src/path'
import PostsLoadingComponent from 'components/Feed/PostsLoading'
import ScrollService from 'services/Scroll'
import useViewable from 'services/providers/Viewable'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import { TRENDING_GALLERY } from 'constants/Gallery'

const {
  numColumns,
  maxToRenderPerBatch,
  initialNumToRender,
  onEndReachedThreshold,
} = TRENDING_GALLERY

const SearchComponent = ({
  t,
  theme,
  feedRef,
  usersSearchRequest,
  usersSearch,
  usersGetTrendingUsers,
  postsGetTrendingPosts,
  postsGetTrendingPostsMoreRequest,
  handleFormFocus,
  formFocus,
  handleFormChange,
  formChange,
  postsGetTrendingPostsRequest,
}) => {
  const styling = styles(theme)

  const scroll = ScrollService({
    resource: postsGetTrendingPosts,
    loadInit: postsGetTrendingPostsRequest,
    loadMore: postsGetTrendingPostsMoreRequest,
  })

  const {
    onViewableItemsThumbnailsRef,
    viewabilityConfigRef,
  } = useViewable()

  const isEmpty = !path(['data', 'length'])(postsGetTrendingPosts)
  const isLoading = path(['status'])(postsGetTrendingPosts) === 'loading'

  const renderItem = useCallback(({ item: post, index: priorityIndex }) => (
    <PostsGridThumbnailComponent post={post} priorityIndex={priorityIndex} thread="posts/trending" />
  ), [])

  return (
    <View style={styling.root}>
      <HeaderComponent>
        <FormComponent
          usersSearch={usersSearch}
          usersSearchRequest={usersSearchRequest}
          handleFormFocus={handleFormFocus}
          handleFormChange={handleFormChange}
          formFocus={formFocus}
        />
      </HeaderComponent>

      {!formFocus && isLoading && isEmpty ? <PostsLoadingComponent /> : null}

      <FlatList
        ref={feedRef}
        data={postsGetTrendingPosts.data}
        numColumns={numColumns}
        maxToRenderPerBatch={maxToRenderPerBatch}
        initialNumToRender={initialNumToRender}
        keyExtractor={(item) => item.postId}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.border}
            onRefresh={scroll.handleRefresh}
            refreshing={scroll.refreshing}
          />
        }
        ListHeaderComponentStyle={styling.header}
        ListFooterComponent={<ActivityIndicator animating={scroll.loadingmore} color={theme.colors.border} />}
        ListFooterComponentStyle={styling.activity}
        onEndReached={scroll.handleLoadMore}
        onEndReachedThreshold={onEndReachedThreshold}
        onViewableItemsChanged={onViewableItemsThumbnailsRef.current}
        viewabilityConfig={viewabilityConfigRef.current}
      />

      {formFocus && formChange ? (
        <View style={styling.overlay}>
          <ScrollView
            keyboardShouldPersistTaps="never"
            ref={feedRef}
            refreshControl={
              <RefreshControl tintColor={theme.colors.border} refreshing={usersSearch.status === 'loading'} />
            }
          >
            <Subheading style={styling.subheading}>{t('Search Result')}</Subheading>
            <UsersList usersSearch={usersSearch} />
          </ScrollView>
        </View>
      ) : null}

      {formFocus && !formChange ? (
        <View style={styling.overlay}>
          <ScrollView
            keyboardShouldPersistTaps="never"
            ref={feedRef}
            refreshControl={
              <RefreshControl tintColor={theme.colors.border} refreshing={usersGetTrendingUsers.status === 'loading'} />
            }
          >
            <Subheading style={styling.subheading}>{t('Trending Users')}</Subheading>
            <UsersList usersSearch={usersGetTrendingUsers} />
          </ScrollView>
        </View>
      ) : null}
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    backgroundColor: theme.colors.backgroundPrimary,
    flex: 1,
  },
  subheading: {
    paddingTop: 6,
    paddingHorizontal: 12,
  },
  activity: {
    padding: theme.spacing.base * 2,
  },
  header: {
    padding: theme.spacing.base,
    paddingBottom: theme.spacing.base / 2,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 64,
    zIndex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
})

SearchComponent.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  usersSearchRequest: PropTypes.any,
  usersSearch: PropTypes.any,
  feedRef: PropTypes.any,
  usersGetTrendingUsers: PropTypes.any,
  postsGetTrendingPosts: PropTypes.any,
  postsGetTrendingPostsMoreRequest: PropTypes.any,
  handleFormFocus: PropTypes.any,
  formFocus: PropTypes.any,
  handleFormChange: PropTypes.any,
  formChange: PropTypes.any,
  postsGetTrendingPostsRequest: PropTypes.func,
}

export default withTranslation()(withTheme(SearchComponent))
