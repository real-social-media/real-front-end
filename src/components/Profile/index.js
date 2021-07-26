import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import CountsComponent from 'components/Profile/Counts'
import AboutComponent from 'components/Profile/About'
import ActionComponent from 'components/Profile/Action'
import AlbumsComponent from 'components/Profile/Albums'
import PostsGridThumbnailComponent from 'components/PostsGrid/Thumbnail'
import Avatar from 'templates/Avatar'
import NativeError from 'templates/NativeError'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'
import * as navigationActions from 'navigation/actions'
import ScrollService from 'services/Scroll'
import * as UserService from 'services/User'
import useViewable from 'services/providers/Viewable'
import testIDs from 'components/Profile/test-ids'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'

const Profile = ({
  t,
  theme,
  profileRef,

  user,
  usersBlock,
  usersGetProfile,

  postsGet,
  postsGetRequest,
  postsGetMoreRequest,

  albumsGet,
  albumsGetRequest,

  usersBlockRequest,
  usersUnblock,
  usersUnblockRequest,
  usersFollow,
  usersFollowRequest,
  usersUnfollow,
  usersUnfollowRequest,
  walletGetRequest,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  const handleUserStoryPress = () => {
    if (!pathOr(0, ['data', 'stories', 'items', 'length'], usersGetProfile)) {
      return
    }

    navigationActions.navigateStory(
      navigation,
      {
        user: usersGetProfile.data,
        usersGetFollowedUsersWithStories: { data: [usersGetProfile.data] },
      },
      { protected: true, user },
    )()
  }

  const scroll = ScrollService({
    resource: postsGet,
    loadInit: (extra) => {
      postsGetRequest(extra)
      albumsGetRequest(extra)
      walletGetRequest && walletGetRequest()
    },
    loadMore: postsGetMoreRequest,
    extra: { userId: path(['data', 'userId'])(usersGetProfile) },
  })

  const {
    onViewableItemsThumbnailsRef,
    viewabilityConfigRef,
  } = useViewable()

  const ProfileHeader = () => (
    <React.Fragment>
      <View style={styling.component}>
        <TouchableOpacity style={styling.image} onPress={handleUserStoryPress}>
          <Avatar
            size="large"
            active={UserService.hasActiveStories(usersGetProfile.data)}
            thumbnailSource={{ uri: path(['data', 'photo', 'url64p'])(usersGetProfile) }}
            imageSource={{ uri: path(['data', 'photo', 'url480p'])(usersGetProfile) }}
            themeCode={path(['data', 'themeCode'])(usersGetProfile)}
          />
        </TouchableOpacity>
        <View style={styling.counts}>
          <CountsComponent
            usersGetProfile={usersGetProfile}
          />
        </View>
      </View>

      <View style={styling.about}>
        <AboutComponent
          navigation={navigation}
          usersGetProfile={usersGetProfile}
        />
      </View>

      <View style={styling.action}>
        <ActionComponent
          usersGetProfile={usersGetProfile}
          usersBlock={usersBlock}
          usersBlockRequest={usersBlockRequest}
          usersUnblock={usersUnblock}
          usersUnblockRequest={usersUnblockRequest}
          usersFollow={usersFollow}
          usersFollowRequest={usersFollowRequest}
          usersUnfollow={usersUnfollow}
          usersUnfollowRequest={usersUnfollowRequest}
        />
      </View>

      <View style={styling.action}>
        <AlbumsComponent
          albumsGet={albumsGet}
        />
      </View>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <NativeError
        handleCancelPress={() => {}}
        titleText={t('User Blocked')}
        messageText={t('The user has been blocked and will no longer have access to yours posts.')}
        actionText={t('Done')}
        status={path(['status'])(usersBlock)}
        triggerOn="success"
      />

      <FlatList
        ref={profileRef}
        data={postsGet.data}
        numColumns={3}
        keyExtractor={item => item.postId}
        testID={testIDs.root}
        renderItem={({ item: post, index: priorityIndex }) => (
          <PostsGridThumbnailComponent
            post={post}
            priorityIndex={priorityIndex}
            thread="posts/profile"
          />
        )}
        refreshControl={(
          <RefreshControl
            tintColor={theme.colors.border}
            onRefresh={scroll.handleRefresh}
            refreshing={scroll.refreshing}
          />
        )}
        ListHeaderComponent={() => (
          <ProfileHeader />
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
    </React.Fragment>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  component: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  image: {
    paddingRight: theme.spacing.base,
  },
  counts: {
    flex: 1,
  },
  about: {
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
  activity: {
    padding: theme.spacing.base * 2,
  },
})

Profile.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.any,
  usersGetProfile: PropTypes.any,
  usersBlock: PropTypes.any,
  usersBlockRequest: PropTypes.any,
  usersUnblock: PropTypes.any,
  usersUnblockRequest: PropTypes.any,
  usersFollow: PropTypes.any,
  usersFollowRequest: PropTypes.any,
  usersUnfollow: PropTypes.any,
  usersUnfollowRequest: PropTypes.any,
  t: PropTypes.any,
  profileRef: PropTypes.any,
  postsGet: PropTypes.any,
  postsGetRequest: PropTypes.any,
  postsGetMoreRequest: PropTypes.any,
  albumsGet: PropTypes.any,
  albumsGetRequest: PropTypes.any,
  albumsGetMoreRequest: PropTypes.any,
  walletGetRequest: PropTypes.func,
}

export default withTranslation()(withTheme(Profile))
