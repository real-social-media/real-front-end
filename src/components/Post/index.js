import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import path from 'ramda/src/path'
import ActionComponent from 'components/Post/Action'
import AlbumComponent from 'components/Post/Album'
import CommentComponent from 'components/Post/Comment'
import DescriptionComponent from 'components/Post/Description'
import HeaderComponent from 'components/Post/Header'
import VideoPlayer from 'components/VideoPlayer'
import UnlockComponent from 'components/Post/Unlock'

import ListItemComponent from 'templates/ListItem'
import CacheComponent from 'components/Cache'
import TextOnlyComponent from 'templates/TextOnly'
import ReactionsPreviewTemplate from 'templates/ReactionsPreview'
import ViewShot from 'react-native-view-shot'
import * as navigationActions from 'navigation/actions'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { unpaid } from 'services/providers/Viewable'
import { isMedia } from 'services/providers/Camera/helpers'

const PostComponent = ({
  theme,
  user,
  post,
  postsArchiveRequest,
  postsFlagRequest,
  postsDeleteRequest,
  postsOnymouslyLikeRequest,
  postsDislikeRequest,
  postsRestoreArchivedRequest,
  priorityIndex,
  handleScrollPrev,
  handleScrollNext,

  createActionSheetRef,
  actionSheetRef,
  createTextPostRef,
  textPostRef,

  feedRef,
  changeAvatarRequest,
  autoPlay,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  const albumLength = path(['album', 'posts', 'items', 'length'])(post) || 0

  const onCapture = (renderUri) => {
    navigationActions.navigatePostShare(navigation, { postId: post.postId, userId: post.postedBy.userId, renderUri })
  }

  const handlePostShare = () => {
    if (post.postType === 'TEXT_ONLY') {
      textPostRef.capture()
    }

    if (post.postType === 'IMAGE') {
      navigationActions.navigatePostShare(navigation, { postId: post.postId, userId: post.postedBy.userId })
    }
  }

  return (
    <View style={styling.root}>
      <TouchableOpacity style={styling.prev} onPress={handleScrollPrev} />
      <TouchableOpacity style={styling.next} onPress={handleScrollNext} />

      <HeaderComponent
        user={user}
        post={post}
        postsArchiveRequest={postsArchiveRequest}
        postsFlagRequest={postsFlagRequest}
        postsDeleteRequest={postsDeleteRequest}
        postsRestoreArchivedRequest={postsRestoreArchivedRequest}
        handlePostShare={handlePostShare}
        createActionSheetRef={createActionSheetRef}
        actionSheetRef={actionSheetRef}
        navigation={navigation}
        changeAvatarRequest={changeAvatarRequest}
      />

      <View style={styling.inner}>
        {post.postType === 'TEXT_ONLY' ? (
          <ViewShot ref={createTextPostRef} onCapture={onCapture}>
            <TextOnlyComponent
              text={post.text}
            >
              <TouchableOpacity style={styling.prev} onPress={handleScrollPrev} />
              <TouchableOpacity style={styling.next} onPress={handleScrollNext} />
            </TextOnlyComponent>
          </ViewShot>
        ) : null}

        {post.postType === 'IMAGE' ? (
          <ListItemComponent
            post={post}
            feedRef={feedRef}
          >
            <CacheComponent
              thread="post"
              images={[
                [path(['image', 'url480p'])(post), true],
                [path(['image', 'url4k'])(post), true],
                [path(['image', 'url'])(post), false],
              ]}
              fallback={path(['image', 'url4k'])(post)}
              priorityIndex={priorityIndex}
              resizeMode="contain"
              hideLabel={false}
            />
            <TouchableOpacity style={styling.prev} onPress={handleScrollPrev} />
            <TouchableOpacity style={styling.next} onPress={handleScrollNext} />
          </ListItemComponent>
        ) : null}

        {post.postType === 'VIDEO' ? (
          <VideoPlayer
            poster={post.image.url}
            source={{
              uri: post.video.urlMasterM3U8,
              headers: {
                Cookie: `CloudFront-Key-Pair-Id=${post.video.accessCookies.keyPairId}; CloudFront-Policy=${post.video.accessCookies.policy}; CloudFront-Signature=${post.video.accessCookies.signature}`,
              },
            }}
            resolution={{
              width: post.video.resolutions[0].width,
              height: post.video.resolutions[0].height,
            }}
            playing={autoPlay}
          />
        ) : null}

        {unpaid(post) ? (
          <UnlockComponent payment={post.payment} postId={post.postId} />
        ) : null}
      </View>

      {albumLength > 1 ? (
        <AlbumComponent post={post} />
      ) : null}

      <ActionComponent
        user={user}
        post={post}
        postsOnymouslyLikeRequest={postsOnymouslyLikeRequest}
        postsDislikeRequest={postsDislikeRequest}
        handlePostShare={handlePostShare}
      />

      <ReactionsPreviewTemplate
        post={post}
        user={user}
      />

      {isMedia(post.postType) ? (
        <DescriptionComponent
          post={post}
        />
      ) : null}

      <CommentComponent post={post} />
    </View>
  )
}
const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
    paddingBottom: theme.spacing.base,
  },
  prev: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50%',
    bottom: 0,
  },
  next: {
    position: 'absolute',
    top: 0,
    left: '50%',
    right: 0,
    bottom: 0,
  },
  inner: {
    position: 'relative',
  },
})

PostComponent.defaultProps = {
  postsGet: {},
  autoPlay: false,
}

PostComponent.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.any,
  feedRef: PropTypes.any,
  postsArchiveRequest: PropTypes.any,
  postsFlag: PropTypes.any,
  postsFlagRequest: PropTypes.any,
  postsDeleteRequest: PropTypes.any,
  postsOnymouslyLikeRequest: PropTypes.any,
  postsDislikeRequest: PropTypes.any,
  usersGetFollowedUsersWithStories: PropTypes.any,
  usersGetFollowedUsersWithStoriesRequest: PropTypes.any,
  post: PropTypes.any,
  postsRestoreArchivedRequest: PropTypes.any,
  priorityIndex: PropTypes.any,
  handleScrollPrev: PropTypes.any,
  handleScrollNext: PropTypes.any,
  createActionSheetRef: PropTypes.any,
  actionSheetRef: PropTypes.any,
  createTextPostRef: PropTypes.any,
  textPostRef: PropTypes.any,
  changeAvatarRequest: PropTypes.func,
  autoPlay: PropTypes.bool,
}

export default withTheme(PostComponent)
