import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, Caption } from 'react-native-paper'
import path from 'ramda/src/path'
import Avatar from 'templates/Avatar'
import BellIcon from 'assets/svg/action/Bell'
import dayjs from 'dayjs'
import * as navigationActions from 'navigation/actions'
import * as UserService from 'services/User'
import PrivacyService from 'services/Privacy'

import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'
import testIDs from 'components/Story/test-ids'

const Header = ({ t, post }) => {
  const styling = styles
  const navigation = useNavigation()

  const repostedUsername = path(['originalPost', 'postedBy', 'username'])(post)

  const [repostVisiblity, verificationVisibility, expiryVisiblity] = useMemo(
    () => [
      PrivacyService.postRepostVisiblity(post),
      PrivacyService.postVerificationVisibility(post),
      PrivacyService.postExpiryVisiblity(post),
    ],
    [post],
  )

  const onProfilePhotoPress = () => {
    navigationActions.navigateProfile(navigation, { userId: post.postedBy.userId })
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
        <TouchableOpacity onPress={() => navigationActions.navigateProfile(navigation, { userId: post.postedBy.userId })}>
          <Text style={styling.headerUsername}>{path(['postedBy', 'username'])(post)}</Text>
        </TouchableOpacity>

        {repostVisiblity ? (
          <TouchableOpacity
            testID={testIDs.header.repostBtn}
            style={styling.verification}
            onPress={() => navigationActions.navigateProfile(navigation, { userId: post.originalPost.postedBy.userId })}
          >
            <Caption style={styling.headerStatus}>
              {t('Reposted from {{ username }}', { username: repostedUsername })}
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

        {verificationVisibility ? (
          <TouchableOpacity
            testID={testIDs.header.verificationStatus}
            onPress={navigationActions.navigateVerification(navigation, { actionType: 'BACK', urlEla: post.image?.urlEla })}
            style={styling.verification}
          >
            <Caption style={styling.verificationStatus}>{t('unauthenticated')}</Caption>
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
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    flex: 1,
  },
  headerAction: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
    width: 38,
  },
  headerUsername: {},
  headerStatus: {
    color: '#676767',
    marginRight: 4,
  },
  verificationStatus: {
    marginRight: 4,
  },
  verification: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

Header.propTypes = {
  t: PropTypes.any,
  post: PropTypes.any,
}

export default withTranslation()(Header)
