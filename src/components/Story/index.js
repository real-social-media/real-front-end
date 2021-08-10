import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import path from 'ramda/src/path'
import Carousel from 'react-native-snap-carousel'
import Layout from 'constants/Layout'
import StepsTemplate from 'templates/Steps'
import HeaderComponent from 'components/Story/Header'
import FooterComponent from 'components/Story/Footer'
import CameraTemplate from 'templates/Camera'
import CameraHeaderTemplate from 'templates/Camera/Header'
import TextOnlyComponent from 'templates/TextOnly'
import { BlurView } from '@react-native-community/blur'
import pathOr from 'ramda/src/pathOr'
import CacheComponent from 'components/Cache'
import ActionComponent from 'components/Post/Action'
import ViewShot from 'react-native-view-shot'
import * as navigationActions from 'navigation/actions'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const StoryCarousel = ({
  theme,
  currentStory,
  onNextStory,
  onPrevStory,
  onCloseStory,
  getTextPostRef,
  textPostRefs,
  navigation,
  postsOnymouslyLikeRequest,
  postsDislikeRequest,
}) =>
  // eslint-disable-next-line react/prop-types
  ({ item: user }) => {
    const styling = styles(theme)

    const post = pathOr(0, ['stories', 'items', currentStory], user)

    const handlePostShare = () => {
      if (post.postType === 'TEXT_ONLY') {
        textPostRef.capture()
      }

      if (post.postType === 'IMAGE') {
        navigationActions.navigatePostShare(navigation, { postId: post.postId })
      }
    }

    const onCapture = (renderUri) => {
      navigationActions.navigatePostShare(navigation, {
        postId: post.postId,
        renderUri,
      })
    }

    if (!post) {
      return null
    }

    const textPostRef = getTextPostRef(post)
    const viewshotRef = (element) => (textPostRefs.current[post.postId] = element)

    return (
      <View style={styling.sliderItem}>
        <View style={styling.backdrop} />
        <BlurView style={styling.blur} />

        <CameraTemplate
          steps={<StepsTemplate steps={user.stories.items.length} currentStep={currentStory} />}
          header={
            <CameraHeaderTemplate
              content={<HeaderComponent post={post} />}
              handleClosePress={onCloseStory}
            />
          }
          content={
            <React.Fragment>
              {post.postType === 'IMAGE' ? (
                <CacheComponent
                  thread="story"
                  images={[
                    [path(['image', 'url480p'])(post), true],
                    [path(['image', 'url4k'])(post), true],
                  ]}
                  fallback={path(['image', 'url4k'])(post)}
                  priorityIndex={1}
                  resizeMode="contain"
                />
              ) : null}

              {post.postType === 'TEXT_ONLY' ? (
                <ViewShot ref={viewshotRef} onCapture={onCapture}>
                  <TextOnlyComponent text={post.text} />
                </ViewShot>
              ) : null}
            </React.Fragment>
          }
          footer={<FooterComponent post={post} />}
          selector={
            <ActionComponent
              user={user}
              post={post}
              postsOnymouslyLikeRequest={postsOnymouslyLikeRequest}
              postsDislikeRequest={postsDislikeRequest}
              handlePostShare={handlePostShare}
            />
          }
          wrapper={
            <React.Fragment>
              <TouchableOpacity style={styling.wrapperLeft} onPress={onPrevStory} />
              <TouchableOpacity style={styling.wrapperRight} onPress={onNextStory} />
            </React.Fragment>
          }
        />
      </View>
    )
  }

const Story = ({
  theme,
  userId,
  stories,
  storyRef,
  countStories,
  currentStory,
  onNextStory,
  onPrevStory,
  onCloseStory,
  onSnapItem,
  createTextPostRef,
  getTextPostRef,
  textPostRefs,
  postsOnymouslyLikeRequest,
  postsDislikeRequest,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  return (
    <View style={styling.root} key={currentStory}>
      <View style={styling.backdrop} />
      <BlurView style={styling.blur} />

      <Carousel
        firstItem={stories.findIndex((user) => user.userId === userId)}
        ref={storyRef}
        data={stories}
        renderItem={StoryCarousel({
          storyRef,
          theme,
          countStories,
          currentStory,
          onNextStory,
          onPrevStory,
          onCloseStory,
          createTextPostRef,
          getTextPostRef,
          textPostRefs,
          navigation,
          postsOnymouslyLikeRequest,
          postsDislikeRequest,
        })}
        sliderWidth={Layout.window.width}
        itemWidth={Layout.window.width}
        removeClippedSubviews={false}
        slideStyle={styling.slideStyle}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        layout="stack"
        onScrollIndexChanged={onSnapItem}
      />
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    photo: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    wrapperLeft: {
      position: 'absolute',
      top: 120,
      left: 0,
      bottom: 120,
      zIndex: 1,
      width: '30%',
    },
    wrapperRight: {
      position: 'absolute',
      top: 120,
      right: 0,
      bottom: 120,
      zIndex: 1,
      width: '70%',
    },
    footer: {
      height: 60,
    },
    sliderItem: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.backgroundPrimary,
      opacity: 0.6,
    },
    blur: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
    },
    steps: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      height: 50,
      paddingTop: 20,
    },
    header: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      top: 50,
      zIndex: 1,
      height: 30,
      paddingHorizontal: 10,
    },
    slideStyle: {
      margin: 0,
      padding: 0,
    },
  })

Story.propTypes = {
  theme: PropTypes.any,
  userId: PropTypes.any,
  stories: PropTypes.any,
  storyRef: PropTypes.any,
  countStories: PropTypes.any,
  currentStory: PropTypes.any,
  onNextStory: PropTypes.any,
  onPrevStory: PropTypes.any,
  onCloseStory: PropTypes.any,
  onSnapItem: PropTypes.any,
  createTextPostRef: PropTypes.any,
  getTextPostRef: PropTypes.any,
  textPostRefs: PropTypes.any,
  postsOnymouslyLikeRequest: PropTypes.any,
  postsDislikeRequest: PropTypes.any,
}

export default withTheme(Story)
