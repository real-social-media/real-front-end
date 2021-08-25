import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import TextCaption from 'components/Formik/TextCaption'
import TextField from 'components/Formik/TextField'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import Avatar from 'templates/Avatar'
import path from 'ramda/src/path'
import RowsComponent from 'templates/Rows'
import RowsItemComponent from 'templates/RowsItem'
import UserRowComponent from 'templates/UserRow'
import CollapsableComponent from 'templates/Collapsable'
import { Text, Caption, Switch } from 'react-native-paper'
import { joinTags, searchTags } from 'components/PostCreate/helpers'
import { useHeader } from 'components/PostCreate/header'
import FormKeywords from 'components/PostCreate/FormKeywords'
import PickerField from 'components/Formik/PickerField'
import * as Validation from 'services/Validation'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

export const a11y = {
  payment:'Toggle Payment per view',
  keywords: 'Toggle Search Terms',

}

const formSchema = Yup.object().shape({
  lifetime: Yup.string().nullable(),
  text: Yup.string().nullable(),
  payment: Validation.payment,
  paymentTicker: Validation.paymentTicker,
})

const PostCreateForm = ({
  t,
  theme,
  handleSubmit,
  values,
  loading,
  handlePostPress,
  setFieldValue,
  formLifetime: FormLifetime,
  formAlbums: FormAlbums,
  albumsGet,
  cameraCaptureLength,
  handleOpenVerification,
  coinsOptions,
}) => {
  const styling = styles(theme)

  const image = {
    url4k: values.preview[0],
    url64p: values.preview[0],
    url1080p: values.preview[0],
  }

  useHeader({
    title: 'Post',
    onPress: handleSubmit,
  })

  return (
    <View style={styling.root}>
      <View style={styling.input}>
        <View style={styling.header}>
          {values.postType === 'IMAGE' ?
            <TouchableOpacity onPress={() => handlePostPress({ image })}>
              <Avatar
                key={values.preview[0]}
                size="bigger"
                thumbnailSource={{ uri: values.preview[0] }}
                imageSource={{ uri: values.preview[0] }}
              />
            </TouchableOpacity>
          : null}

          <View style={styling.text}>
            <Field name="text" component={TextCaption} placeholder={t('Write a caption')} multiline={true} />
          </View>
        </View>
      </View>

      <CollapsableComponent
        style={styling.input}
        title={t('Lifetime')}
        helper={t('Change post expiry, set expiry to 1 day to post story')}
        active
      >
        <FormLifetime
          values={values}
          setFieldValue={setFieldValue}
        />
      </CollapsableComponent>

      <CollapsableComponent
        style={styling.input}
        title={t('Albums')}
        helper={t('Add this post to an album')}
      >
        <FormAlbums
          values={values}
          setFieldValue={setFieldValue}
          albumsGet={albumsGet}
        />
      </CollapsableComponent>

      <CollapsableComponent
        style={styling.input}
        title={t('Privacy')}
        helper={t('Allow others to comment, like, and share your post')}
      >
        <RowsComponent items={[{
          label: t('Comments'),
          caption: t('Followers can comment on posts'),
          onPress: () => setFieldValue('commentsDisabled', !values.commentsDisabled),
          type: 'action',
          enabled: !values.commentsDisabled,
        }, {
          label: t('Likes'),
          caption: t('Followers can like your post'),
          onPress: () => setFieldValue('likesDisabled', !values.likesDisabled),
          type: 'action',
          enabled: !values.likesDisabled,
        }, {
          label: t('Sharing'),
          caption: t('Followers can share posts'),
          onPress: () => setFieldValue('sharingDisabled', !values.sharingDisabled),
          type: 'action',
          enabled: !values.sharingDisabled,
        }]}>
          {(settings) => (
            <RowsItemComponent hasBorders>
              <UserRowComponent
                onPress={path(['onPress'])(settings)}
                content={
                  <View style={styling.user}>
                    <Text style={styling.username}>{path(['label'])(settings)}</Text>
                    <Caption>{path(['caption'])(settings)}</Caption>
                  </View>
                }
                action={
                  <Switch
                    value={path(['enabled'])(settings)}
                    onValueChange={settings.onPress}
                  />
                }
              />
            </RowsItemComponent>
          )}
        </RowsComponent>
      </CollapsableComponent>

      <CollapsableComponent
        style={styling.input}
        title={t('Payment per view')}
        helper={t('Auto by default')}
        accessibilityLabel={a11y.payment}
        active
      >
        <View style={styling.row}>
          <Field
            name="paymentTicker"
            accessibilityLabel="paymentTicker"
            label={t('Restrict To Coin')}
            component={PickerField}
            items={coinsOptions}
          />
        </View>
        <View style={styling.row}>
          <Field
            {...Validation.getInputTypeProps('payment')}
            name="payment"
            component={TextField}
            placeholder={t('$0-100 REAL coins')}
          />
        </View>
      </CollapsableComponent>

      <CollapsableComponent
        style={styling.input}
        title={t('Search Terms')}
        helper={t('Add tags for search optimization')}
        accessibilityLabel={a11y.keywords}
      >
        <FormKeywords
          values={values}
          setFieldValue={setFieldValue}
        />
      </CollapsableComponent>

      <View style={styling.input}>
        <DefaultButton label={t('Create Post')} onPress={handleSubmit} loading={loading} disabled={loading} />
      </View>

      {handleOpenVerification ?
        <View style={styling.input}>
          <DefaultButton label={t('Trending Tips')} onPress={handleOpenVerification} mode="outlined" disabled={loading} />
        </View>
      : null }

      {cameraCaptureLength > 1 ?
        <View style={styling.helper}>
          <Caption>{cameraCaptureLength - 1} more post left to be uploaded</Caption>
        </View>
      : null}
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
  },
  header: {
    flexDirection: 'row',
  },
  text: {
    flex: 1,
  },
  input: {
    marginBottom: theme.spacing.base,
  },
  title: {
    marginBottom: theme.spacing.base,
  },
  helper: {
    alignItems: 'center',
  },
  row: {
    marginBottom: 12,
  },
})

PostCreateForm.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  handleSubmit: PropTypes.any,
  values: PropTypes.any,
  loading: PropTypes.any,
  handlePostPress: PropTypes.any,
  setFieldValue: PropTypes.any,
  formLifetime: PropTypes.any,
  formAlbums: PropTypes.any,
  albumsGet: PropTypes.any,
  cameraCaptureLength: PropTypes.any,
  handleOpenVerification: PropTypes.func,
  coinsOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
}

PostCreateForm.defaultProps = {
  coinsOptions: [],
}

const FormWrapper = ({
  postsCreateRequest,
  cameraCapture,
  ...props
}) => {
  const handleSubmit = (values) => {
    const keywords = joinTags(searchTags(values.text), values.keywords)
    postsCreateRequest({ ...values, keywords })
  }

  return (
    <Formik
      initialValues={{
        lifetime: null,
        postType: props.postType,
        likesDisabled: props.user.likesDisabled,
        commentsDisabled: props.user.commentsDisabled,
        sharingDisabled: props.user.sharingDisabled,
        verificationHidden: props.user.verificationHidden,
        text: path(['text'])(cameraCapture),
        preview: [path(['preview'])(cameraCapture)],
        images: [path(['uri'])(cameraCapture)],
        takenInReal: path(['takenInReal'])(cameraCapture),
        payment: path(['payment'])(cameraCapture),
        paymentTicker: undefined,
        imageFormat: path(['imageFormat'])(cameraCapture),
        originalFormat: path(['originalFormat'])(cameraCapture),
        originalMetadata: path(['originalMetadata'])(cameraCapture),
        crop: path(['crop'])(cameraCapture),
        keywords: [],
      }}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <PostCreateForm
          {...formikProps}
          {...props}
        />
      )}
    </Formik>
  )
}

FormWrapper.propTypes = {
  postsCreateRequest: PropTypes.any,
  cameraCapture: PropTypes.any,
  user: PropTypes.any,
  postType: PropTypes.any,
  handleOpenVerification: PropTypes.func,
}

export default withTranslation()(withTheme(FormWrapper))
