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
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  const albumLength = path(['album', 'posts', 'items', 'length'])(post) || 0

  const onCapture = (renderUri) => {
    navigationActions.navigatePostShare(navigation, { postId: post.postId, renderUri })
  }

  const handlePostShare = () => {
    if (post.postType === 'TEXT_ONLY') {
      textPostRef.capture()
    }

    if (post.postType === 'IMAGE') {
      navigationActions.navigatePostShare(navigation, { postId: post.postId })
    }
  }

  return (
    <View style={styling.root}>
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
        {post.postType === 'TEXT_ONLY' ?
          <ViewShot ref={createTextPostRef} onCapture={onCapture}>
            <TextOnlyComponent text={post.text} />
          </ViewShot>
        : null}

        {post.postType === 'IMAGE' ?
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
          </ListItemComponent>
        : null}

        {handleScrollPrev ?
          <TouchableOpacity style={styling.prev} onPress={handleScrollPrev} />
        : null}

        {handleScrollNext ?
          <TouchableOpacity style={styling.next} onPress={handleScrollNext} />
        : null}

        {unpaid(post) ?
          <UnlockComponent payment={post.payment} postId={post.postId} />
        : null}
      </View>

      {albumLength > 1 ?
        <AlbumComponent post={post} />
      : null}

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

      {post.postType === 'IMAGE' ?
        <DescriptionComponent
          post={post}
        />
      : null}

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
  handleScrollPrev: null,
  handleScrollNext: null,
}

PostComponent.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.any,
  feedRef: PropTypes.any,
  postsArchiveRequest: PropTypes.any,
  postsFlagRequest: PropTypes.any,
  postsDeleteRequest: PropTypes.any,
  postsOnymouslyLikeRequest: PropTypes.any,
  postsDislikeRequest: PropTypes.any,
  post: PropTypes.any,
  postsRestoreArchivedRequest: PropTypes.any,
  priorityIndex: PropTypes.any,
  handleScrollPrev: PropTypes.func,
  handleScrollNext: PropTypes.func,
  createActionSheetRef: PropTypes.any,
  actionSheetRef: PropTypes.any,
  createTextPostRef: PropTypes.any,
  textPostRef: PropTypes.any,
  changeAvatarRequest: PropTypes.func,
}

export default withTheme(PostComponent)
