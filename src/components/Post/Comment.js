import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Text } from 'react-native-paper'
import * as navigationActions from 'navigation/actions'
import pathOr from 'ramda/src/pathOr'
import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'
import linkifyText from 'services/helpers/linkifyText'

const Comment = ({
  t,
  theme,
  post,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={navigationActions.navigateComments(navigation, { postId: post.postId })} style={styling.root}>
      {pathOr(0, ['commentsCount'], post) > 3 ?
        <Text style={styling.count}>{t('View all comments')}</Text>
      : null}

      {pathOr([], ['comments', 'items'], post).map((comment, key) => (
        <Text style={styling.comment} numberOfLines={4} ellipsizeMode="tail" key={key}>
          {[
            /**
             * Username of post owner
             */
            <Text key="username" style={styling.author}>{pathOr('', ['commentedBy', 'username'])(comment)} </Text>,

            /**
             * Tagged @username occurrences with attached user object
             */
            ...linkifyText({
              text: pathOr('', ['text'])(comment).trim(),
              textTaggedUsers: pathOr([], ['textTaggedUsers'])(comment),
              navigation,
            }),
          ]}
        </Text>
      ))}
    </TouchableOpacity>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    paddingHorizontal: theme.spacing.base,
    marginBottom: 6,
  },
  comment: {
    marginBottom: 4,
    flex: 1,
  },
  count: {
    paddingVertical: 6,
    opacity: 0.6,
  },
  author: {
    fontWeight: '700',
  },
})

Comment.propTypes = {
  theme: PropTypes.any,
  t: PropTypes.any,
  post: PropTypes.any,
}

export default withTranslation()(withTheme(Comment))
