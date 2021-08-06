import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import BubbleIcon from 'assets/svg/action/Bubble'
import DirectIcon from 'assets/svg/action/Direct'
import LikeIcon from 'assets/svg/action/Like'
import UnlikeIcon from 'assets/svg/action/Unlike'
import { Caption } from 'react-native-paper'
import dayjs from 'dayjs'
import * as navigationActions from 'navigation/actions'
import PrivacyService from 'services/Privacy'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const Action = ({ t, theme, user, post, postsOnymouslyLikeRequest, postsDislikeRequest, handlePostShare }) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  const [likeStatus, setLikeStatus] = useState(post.likeStatus)

  const handleLikeRequest = () => {
    setLikeStatus('ONYMOUSLY_LIKED')
    postsOnymouslyLikeRequest({ postId: post.postId })
  }
  const handleDisikeRequest = () => {
    setLikeStatus('NOT_LIKED')
    postsDislikeRequest({ postId: post.postId })
  }

  const [likeButtonVisibility, commentButtonVisibility, shareButtonVisibility, seenByVisibility] = useMemo(
    () => [
      PrivacyService.postLikeVisibility(post, user),
      PrivacyService.postCommentVisibility(post, user),
      PrivacyService.postShareVisibility(post, user),
      PrivacyService.postSeenByVisility(post, user),
    ],
    [post, user],
  )

  return (
    <View style={styling.action}>
      <View style={styling.actionLeft}>
        {likeButtonVisibility && likeStatus === 'NOT_LIKED' ? (
          <TouchableOpacity testID={testIDs.action.likeBtn} style={styling.actionLeftIcon} onPress={handleLikeRequest}>
            <LikeIcon fill={theme.colors.primaryIcon} />
          </TouchableOpacity>
        ) : null}

        {likeButtonVisibility && likeStatus === 'ONYMOUSLY_LIKED' ? (
          <TouchableOpacity
            testID={testIDs.action.dislikeBtn}
            style={styling.actionLeftIcon}
            onPress={handleDisikeRequest}
          >
            <UnlikeIcon fill={theme.colors.primary} />
          </TouchableOpacity>
        ) : null}

        {commentButtonVisibility ? (
          <TouchableOpacity
            testID={testIDs.action.commentBtn}
            style={styling.actionLeftIcon}
            onPress={navigationActions.navigateComments(navigation, {
              postId: post.postId,
            })}
          >
            <BubbleIcon fill={theme.colors.primaryIcon} />
          </TouchableOpacity>
        ) : null}

        {shareButtonVisibility ? (
          <TouchableOpacity testID={testIDs.action.shareBtn} style={styling.actionLeftIcon} onPress={handlePostShare}>
            <DirectIcon fill={theme.colors.primaryIcon} />
          </TouchableOpacity>
        ) : null}
      </View>

      {seenByVisibility ? (
        <TouchableOpacity
          testID={testIDs.action.seenByBtn}
          style={styling.actionRight}
          onPress={() => navigationActions.navigatePostViews(navigation, { postId: post.postId })}
        >
          <Caption>{t('Seen by {{viewedByCount}} people', { viewedByCount: post.viewedByCount })}</Caption>
        </TouchableOpacity>
      ) : (
        <View testID={testIDs.action.postedAt} style={styling.actionRight}>
          <Caption>{dayjs(post.postedAt).from(dayjs())}</Caption>
        </View>
      )}
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    action: {
      zIndex: 1,
      flexDirection: 'row',
      padding: theme.spacing.base,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    actionLeftIcon: {
      marginRight: 18,
    },
    actionLeft: {
      flex: 1,
      flexDirection: 'row',
    },
    actionRight: {
      flex: 1,
      flexDirection: 'row-reverse',
    },
  })

Action.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  user: PropTypes.any,
  post: PropTypes.shape({
    postId: PropTypes.string,
    postedBy: PropTypes.shape({ userId: PropTypes.string }),
    postedAt: PropTypes.string,
    viewedByCount: PropTypes.number,
    likeStatus: PropTypes.oneOf(['ONYMOUSLY_LIKED', 'ANONYMOUSLY_LIKED', 'NOT_LIKED']),
  }),
  postsOnymouslyLikeRequest: PropTypes.func,
  postsDislikeRequest: PropTypes.func,
  handlePostShare: PropTypes.func,
}

export default withTranslation()(withTheme(Action))
