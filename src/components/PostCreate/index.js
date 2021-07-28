import React from 'react'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  View,
  StyleSheet,
} from 'react-native'
import PostCreateForm from 'components/PostCreate/Form'
import FormLifetime from 'components/PostCreate/FormLifetime'
import FormAlbums from 'components/PostCreate/FormAlbums'
import { withTheme } from 'react-native-paper'
import { isMedia } from 'services/providers/Camera/helpers'

const PostCreateComponent = ({
  theme,
  user,
  cameraCapture,
  cameraCaptureLength,
  postsCreateRequest,
  postsCreate,
  handlePostPress,
  albumsGet,
  type,
  handleOpenVerification,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
        {type === 'TEXT_ONLY' ? (
          <View style={styling.form}>
            <PostCreateForm
              user={user}
              postsCreate={postsCreate}
              postsCreateRequest={postsCreateRequest}
              cameraCapture={{ data: {} }}
              cameraCaptureLength={cameraCaptureLength}
              handlePostPress={handlePostPress}
              formLifetime={FormLifetime}
              formAlbums={FormAlbums}
              albumsGet={albumsGet}
              postType={type}
            />
          </View>
        ) : null}

        {isMedia(type) && cameraCapture ? (
          <View style={styling.form}>
            <PostCreateForm
              user={user}
              postsCreate={postsCreate}
              postsCreateRequest={postsCreateRequest}
              cameraCapture={cameraCapture}
              cameraCaptureLength={cameraCaptureLength}
              handlePostPress={handlePostPress}
              formLifetime={FormLifetime}
              formAlbums={FormAlbums}
              albumsGet={albumsGet}
              postType={type}
              handleOpenVerification={handleOpenVerification}
            />
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </View>
  )
}

PostCreateComponent.propTypes = {
  theme: PropTypes.any,
  cameraCapture: PropTypes.any,
  postsCreateRequest: PropTypes.any,
  postsCreate: PropTypes.any,
  user: PropTypes.any,
  cameraCaptureLength: PropTypes.any,
  handlePostPress: PropTypes.any,
  albumsGet: PropTypes.any,
  type: PropTypes.any,
  handleOpenVerification: PropTypes.func,
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

export default withTheme(PostCreateComponent)
