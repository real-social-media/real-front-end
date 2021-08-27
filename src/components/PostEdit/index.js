import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PostEditForm from 'components/PostEdit/Form'
import FormAlbums from 'components/PostEdit/FormAlbums'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const PostEditComponent = ({
  theme,
  postsEditRequest,
  postsEdit,
  handlePostPress,
  postsSingleGet,
  albumsGet,
  coinsOptions,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  return (
    <View style={styling.root}>
      <KeyboardAwareScrollView>
        <View style={styling.form}>
          <PostEditForm
            navigation={navigation}
            postsEdit={postsEdit}
            postsEditRequest={postsEditRequest}
            postsSingleGet={postsSingleGet}
            formAlbums={FormAlbums}
            albumsGet={albumsGet}
            handlePostPress={handlePostPress}
            coinsOptions={coinsOptions}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

PostEditComponent.propTypes = {
  theme: PropTypes.any,
  postsEditRequest: PropTypes.any,
  postsEdit: PropTypes.any,
  postsSingleGet: PropTypes.any,
  handlePostPress: PropTypes.any,
  albumsGet: PropTypes.any,
  coinsOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
}

PostEditComponent.defaultProps = {
  coinsOptions: [],
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  form: {
    padding: theme.spacing.base,
  },
})

export default withTheme(PostEditComponent)
