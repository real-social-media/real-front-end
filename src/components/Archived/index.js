import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
} from 'react-native'
import path from 'ramda/src/path'
import GridComponent from 'templates/Grid'
import GridItemComponent from 'templates/GridItem'
import CacheComponent from 'components/Cache'
import * as navigationActions from 'navigation/actions'

import { useNavigation } from '@react-navigation/native'

const Archived = ({
  postsGetArchived,
}) => {
  const styling = styles
  const navigation = useNavigation()

  return (
    <ScrollView style={styling.root}>
      <GridComponent items={path(['data'])(postsGetArchived)}>
        {(post, priorityIndex) => (
          <GridItemComponent
            onPress={() => navigationActions.navigatePostMedia(navigation, { postId: post.postId })}
            active={false}
            activeIcon={null}
            inactiveIcon={null}
          >
            <CacheComponent
              thread="archived"
              images={[
                [path(['image', 'url64p'])(post), true],
                [path(['image', 'url480p'])(post), true],
              ]}
              fallback={path(['image', 'url480p'])(post)}
              priorityIndex={priorityIndex}
              resizeMode="cover"
            />
          </GridItemComponent>
        )}
      </GridComponent>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

Archived.defaultProps = {
  usersImagePostsGet: {},
}

Archived.propTypes = {
  postsGetArchived: PropTypes.any,
}

export default Archived
