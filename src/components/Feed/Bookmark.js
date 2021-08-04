import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { Subheading } from 'react-native-paper'
import Avatar from 'templates/Avatar'
import path from 'ramda/src/path'
import * as navigationActions from 'navigation/actions'
import { useSelector } from 'react-redux'
import * as postsSelector from 'store/ducks/posts/selectors'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'

const Bookmark = ({
  t,
  theme,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  const postsGetTrendingPosts = useSelector(postsSelector.postsGetTrendingPostsSelector)

  return (
    <TouchableOpacity accessibilityLabel="Explore Page Banner" style={styling.root} onPress={() => navigationActions.navigateSearch(navigation)}>
      <View style={styling.text}>
        <Subheading>{t('You\'re All Caught Up')}</Subheading>
      </View>

      <ScrollView style={styling.posts} horizontal>
        {(path(['data'])(postsGetTrendingPosts) || []).filter(item => item.postType !== 'TEXT_ONLY').map((post, key) => (
          <Avatar
            key={key}
            thumbnailSource={{ uri: path(['image', 'url64p'])(post) }}
            imageSource={{ uri: path(['image', 'url64p'])(post) }}
          />
        ))}
      </ScrollView>

      <View style={styling.text}>
        <Subheading>{t('Tap to discover')}</Subheading>
      </View>
    </TouchableOpacity>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    height: 140,
  },
  text: {
    marginVertical: theme.spacing.base,
  },
  posts: {
    flexDirection: 'row',
  },
})

Bookmark.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  postsGetTrendingPosts: PropTypes.any,
}

export default withTranslation()(withTheme(Bookmark))
