import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import path from 'ramda/src/path'
import { Text } from 'react-native-paper'
import * as navigationActions from 'navigation/actions'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import linkifyText from 'services/helpers/linkifyText'

const Description = ({
  theme,
  post,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()
  const visibility = path(['text', 'length'])(post)

  if (!visibility) {
    return null
  }

  return (
    <TouchableOpacity style={styling.root} onPress={navigationActions.navigateComments(navigation, { postId: post.postId })}>
      <Text style={styling.text} numberOfLines={4} ellipsizeMode="tail">
        {[
          /**
           * Username of post owner
           */
          <Text key="username" onPress={() => navigationActions.navigateProfile(navigation, { userId: post.postedBy.userId })} style={styling.username}>{post.postedBy.username} </Text>,

          /**
           * Tagged @username occurrences with attached user object
           */
          ...linkifyText({
            text: path(['text'], post),
            textTaggedUsers: path(['textTaggedUsers'])(post),
            navigation,
          }),
        ]}
      </Text>
    </TouchableOpacity>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    paddingHorizontal: theme.spacing.base,
    marginBottom: 6,
  },
  likes: {
  },
  username: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  text: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

Description.propTypes = {
  theme: PropTypes.any,
  post: PropTypes.any,
}

export default withTheme(Description)
