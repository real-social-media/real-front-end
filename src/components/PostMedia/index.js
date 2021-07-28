import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from 'react-native'
import PostComponent from 'components/Post'
import NativeError from 'templates/NativeError'
import useViewable from 'services/providers/Viewable'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import isEmpty from 'ramda/src/isEmpty'

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

  handleScrollNext,
  handleScrollPrev,

  feedRef,
  actionSheetRefs,
  textPostRefs,
}) => {
  const styling = styles(theme)
  const data = isEmpty(postsSingleGet.data) ? [] : [postsSingleGet.data]

  const {
    onViewableItemsFocusRef,
    viewabilityConfigRef,
  } = useViewable()

  return (
    <View style={styling.root}>
      <NativeError
        handleCancelPress={() => {}}
        titleText={t('All good!')}
        messageText={t('This post has been flagged as inappropriate')}
        actionText={t('Done')}
        status={postsFlag.status}
        triggerOn="success"
      />

      <FlatList
        bounces={false}
        ref={feedRef}
        keyExtractor={item => item.postId}
        data={data}
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.border}
            refreshing={postsSingleGet.status === 'loading'}
          />
        }
        onViewableItemsChanged={onViewableItemsFocusRef.current}
        viewabilityConfig={viewabilityConfigRef.current}
        renderItem={({ item: post, index }) => (
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
            priorityIndex={index}

            handleScrollPrev={handleScrollPrev(index)}
            handleScrollNext={handleScrollNext(index)}
            createActionSheetRef={element => actionSheetRefs.current[post.postId] = element}
            actionSheetRef={actionSheetRefs.current[post.postId]}
            createTextPostRef={element => textPostRefs.current[post.postId] = element}
            textPostRef={textPostRefs.current[post.postId]}
            autoPlay
          />
        )}
      />
    </View>
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
  feedRef: PropTypes.any,
  postsArchiveRequest: PropTypes.any,
  postsFlag: PropTypes.any,
  postsFlagRequest: PropTypes.any,
  postsDeleteRequest: PropTypes.any,
  changeAvatarRequest: PropTypes.func,
  postsOnymouslyLikeRequest: PropTypes.any,
  postsDislikeRequest: PropTypes.any,
  usersGetFollowedUsersWithStories: PropTypes.any,
  usersGetFollowedUsersWithStoriesRequest: PropTypes.any,
  t: PropTypes.any,
  postsRestoreArchivedRequest: PropTypes.any,
  postsSingleGet: PropTypes.any,
  postsGetTrendingPosts: PropTypes.any,
  handleScrollNext: PropTypes.any,
  handleScrollPrev: PropTypes.any,
  actionSheetRefs: PropTypes.any,
  textPostRefs: PropTypes.any,
}

export default withTranslation()(withTheme(PostMedia))
