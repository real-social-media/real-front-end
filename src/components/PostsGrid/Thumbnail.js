import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import GridItemComponent from 'templates/GridItem'
import CacheComponent from 'components/Cache'
import TextOnlyComponent from 'templates/TextOnly/Thumbnail'
import path from 'ramda/src/path'
import * as navigationActions from 'navigation/actions'
import BellIcon from 'assets/svg/action/Bell'

import { useNavigation } from '@react-navigation/native'
import testIDs from './test-ids'

const PostsGridThumbnail = ({
  post,
  priorityIndex,
  thread,
  disabled,
}) => {
  const styling = styles
  const navigation = useNavigation()

  /**
   * Icon to be rendered over thumbnail when post has activity e.g. new comment
   */
  const activeIcon = useMemo(() => (
    <View testID={testIDs.thumbnail.activeIcon} style={styling.icon}>
      <BellIcon fill="red" />
    </View>
  ), [])

  /**
   * Condition to cheeck when activeIcon is rendered e.g. new comment
   */
  const isActive = path(['commentsUnviewedCount'])(post) > 0

  /**
   * progress loader will be rendered except when condition below is true e.g. hide on trending
   */
  const hideProgress = useMemo(() => {
    return ['posts/trending'].includes(thread)
  }, [thread])

  /**
   * navigation is always the same for posts
   */
  const handleOnPress = useCallback(() => {
    navigationActions.navigatePostMedia(navigation, { postId: post.postId, userId: post.postedBy.userId })
  }, [post.postId])

  /**
   * array of images to render, images are rendered in sequence
   */
  const images = useMemo(() => {
    return [[path(['image', 'url480p'])(post), true]]
  }, [post.postId])

  /**
   * fallback url if any of images failed to load
   */
  const fallback = useMemo(() => {
    return path(['image', 'url480p'])(post)
  }, [])

  return (
    <View style={styling.root}>
      <GridItemComponent
        onPress={disabled ? null : handleOnPress}
        active={isActive}
        activeIcon={activeIcon}
        inactiveIcon={null}
      >
        {post.postType === 'IMAGE' ?
          <CacheComponent
            thread={thread}
            images={images}
            fallback={fallback}
            priorityIndex={priorityIndex}
            hideProgress={hideProgress}
            resizeMode="cover"
          />
        : null}

        {post.postType === 'TEXT_ONLY' ?
          <TextOnlyComponent text={post.text} />
        : null}
      </GridItemComponent>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    padding: 12,
  },
})

PostsGridThumbnail.propTypes = {
  post: PropTypes.any,
  priorityIndex: PropTypes.any,
  thread: PropTypes.any,
  disabled: PropTypes.bool,
}

PostsGridThumbnail.defaultProps = {
  disabled: false,
}

export default PostsGridThumbnail
