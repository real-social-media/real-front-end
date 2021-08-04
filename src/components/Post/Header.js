import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import ActionSheet from 'components/ActionSheet'
import Username from 'components/Post/Username'
import { Caption } from 'react-native-paper'
import path from 'ramda/src/path'
import Avatar from 'templates/Avatar'
import MoreIcon from 'assets/svg/action/More'
import BellIcon from 'assets/svg/action/Bell'
import dayjs from 'dayjs'
import * as navigationActions from 'navigation/actions'
import * as UserService from 'services/User'
import PrivacyService from 'services/Privacy'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const Header = ({
  t,
  theme,
  user,
  post,
  postsArchiveRequest,
  postsFlagRequest,
  postsDeleteRequest,
  postsRestoreArchivedRequest,
  handlePostShare,
  createActionSheetRef,
  actionSheetRef,
  navigation,
  changeAvatarRequest,
}) => {
  const styling = styles(theme)

  const handleOptionsPress = () => actionSheetRef && actionSheetRef.show()
  const archived = path(['postStatus'])(post) === 'ARCHIVED'
  const isUserPostOwner = path(['userId'])(user) === path(['postedBy', 'userId'])(post)
  const isPostVerified = path(['isVerified'])(post)
  const isAd = post?.adStatus === 'ACTIVE'

  const [repostVisiblity, verificationVisibility, expiryVisiblity] = useMemo(
    () => [
      PrivacyService.postRepostVisiblity(post),
      PrivacyService.postVerificationVisibility(post),
      PrivacyService.postExpiryVisiblity(post),
    ],
    [post],
  )
  const shareButtonVisibility = useMemo(() => PrivacyService.postShareVisibility(post, user), [post, user])

  const onProfilePhotoPress = () => {
    const hasStories = path(['stories', 'items', 'length'])(post.postedBy)
    if (hasStories) {
      navigationActions.navigateStory(
        navigation,
        {
          user: post.postedBy,
          usersGetFollowedUsersWithStories: { data: [post.postedBy] },
        },
        { protected: true, user },
      )()
    } else {
      navigationActions.navigateProfile(navigation, { userId: post.postedBy.userId })
    }
  }

  return (
    <View style={styling.header}>
      <TouchableOpacity onPress={onProfilePhotoPress}>
        <Avatar
          active={UserService.hasActiveStories(path(['postedBy'])(post))}
          thumbnailSource={{ uri: path(['postedBy', 'photo', 'url64p'])(post) }}
          imageSource={{ uri: path(['postedBy', 'photo', 'url64p'])(post) }}
          themeCode={path(['postedBy', 'themeCode'])(post)}
        />
      </TouchableOpacity>

      <View style={styling.headerText}>
        <TouchableOpacity onPress={() => navigationActions.navigateProfile(navigation, { userId: path(['postedBy', 'userId'], post) })} >
          <Username user={post.postedBy} />
        </TouchableOpacity>

        {repostVisiblity ? (
          <TouchableOpacity
            testID={testIDs.header.repostBtn}
            style={styling.verification}
            onPress={() => navigationActions.navigateProfile(navigation, { userId: path(['originalPost', 'postedBy', 'userId'], post) })}
          >
            <Caption style={styling.headerStatus}>
              {t('Reposted from {{ username }}', { username: path(['originalPost', 'postedBy', 'username'], post) })}
            </Caption>
          </TouchableOpacity>
        ) : null}

        {expiryVisiblity ? (
          <View testID={testIDs.header.expiry} style={styling.verification}>
            <Caption style={styling.headerStatus}>
              {t('Expires {{expiry}}', { expiry: dayjs(post.expiresAt).from(dayjs()) })}
            </Caption>
          </View>
        ) : null}

        {isAd ? (
          <Caption style={styling.statusLabel}>{t('Advertisement')}</Caption>
        ) : verificationVisibility ? (
          <TouchableOpacity
            testID={testIDs.header.verificationStatus}
            onPress={navigationActions.navigateVerification(navigation, { actionType: 'BACK', urlEla: post.image?.urlEla })}
            style={styling.verification}
          >
            <Caption style={styling.statusLabel}>{t('unauthenticated')}</Caption>
          </TouchableOpacity>
        ) : null}
      </View>

      {path(['commentsUnviewedCount'])(post) ? (
        <TouchableOpacity
          style={styling.headerAction}
          onPress={navigationActions.navigateComments(navigation, {
            postId: post.postId,
            userId: post.postedBy.userId,
          })}
        >
          <BellIcon fill="red" />
        </TouchableOpacity>
      ) : null}

      <React.Fragment>
        <TouchableOpacity
          testID={testIDs.header.openDropDownMenu}
          style={styling.headerAction}
          onPress={handleOptionsPress}
        >
          <MoreIcon fill={theme.colors.primaryIcon} />
        </TouchableOpacity>

        <ActionSheet
          testID={testIDs.header.openDropDownMenu}
          actionSheetRef={createActionSheetRef}
          options={[
            {
              name: t('Set as profile picture'),
              onPress: () => changeAvatarRequest({ postId: post.postId }),
              isVisible: isUserPostOwner && isPostVerified && !archived,
            },
            {
              name: t('Restore from Archived'),
              onPress: () => postsRestoreArchivedRequest({ postId: post.postId, userId: path(['userId'])(user) }),
              isVisible: isUserPostOwner && archived,
            },
            {
              name: t('Share'),
              onPress: () => handlePostShare(),
              isVisible: shareButtonVisibility,
            },
            {
              name: t('Report'),
              onPress: () => postsFlagRequest({ postId: post.postId, userId: path(['userId'])(user) }),
              isVisible: !isUserPostOwner,
            },
            {
              name: t('Edit'),
              onPress: () => navigationActions.navigatePostEdit(navigation, { post }),
              isVisible: isUserPostOwner && !archived,
            },
            {
              name: t('Archive'),
              onPress: () => postsArchiveRequest({ postId: post.postId, userId: path(['postedBy', 'userId'])(post) }),
              isVisible: isUserPostOwner && !archived,
            },
            {
              name: t('Delete'),
              onPress: () => postsDeleteRequest({ postId: post.postId, userId: path(['postedBy', 'userId'])(post) }),
              isVisible: isUserPostOwner && !archived,
              isDestructive: true,
            },
            {
              name: t('Cancel'),
              onPress: () => {},
              isCancel: true,
            },
          ]}
        />
      </React.Fragment>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    header: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.base,
    },
    headerText: {
      paddingHorizontal: 8,
      flex: 1,
    },
    headerAction: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      width: 38,
    },
    headerStatus: {
      color: '#676767',
      marginRight: 4,
    },
    statusLabel: {
      marginRight: 4,
    },
    verification: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

Header.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  user: PropTypes.any,
  post: PropTypes.any,
  postsArchiveRequest: PropTypes.func,
  postsFlagRequest: PropTypes.func,
  postsDeleteRequest: PropTypes.func,
  postsRestoreArchivedRequest: PropTypes.func,
  handlePostShare: PropTypes.func,
  createActionSheetRef: PropTypes.any,
  actionSheetRef: PropTypes.any,
  navigation: PropTypes.any,
  changeAvatarRequest: PropTypes.func,
}

export default withTranslation()(withTheme(Header))
