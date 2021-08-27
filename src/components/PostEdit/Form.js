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
import { useHeader } from 'components/PostEdit/header'
import FormKeywords from 'components/PostCreate/FormKeywords'
import PickerField from 'components/Formik/PickerField'
import SliderField from 'components/Formik/SliderField'
import * as Validation from 'services/Validation'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import * as lifetime from 'services/helpers/lifetime'

export const a11y = {
  payment:'Toggle Payment per view',
  keywords: 'Toggle Search Terms',
}

const formSchema = Yup.object().shape({
  text: Yup.string().nullable(),
  payment: Validation.payment,
  paymentTicker: Validation.paymentTicker,
})

const normalizeValues = values => ({
  ...values,
  payment: parseFloat(values.payment),
})

const PostEditForm = ({
  t,
  theme,
  handleSubmit,
  values,
  loading,
  handlePostPress,
  setFieldValue,
  formAlbums: FormAlbums,
  albumsGet,
  coinsOptions,
}) => {
  const styling = styles(theme)

  const image = {
    url4k: values.uri,
    url64p: values.uri,
    url1080p: values.uri,
  }

  useHeader({
    title: 'Save',
    onPress: handleSubmit,
  })

  return (
    <View style={styling.root}>
      <View style={styling.input}>
        <View style={styling.header}>
          {values.postType === 'IMAGE' ?
            <TouchableOpacity onPress={() => handlePostPress({ image })}>
              <Avatar
                size="bigger"
                thumbnailSource={{ uri: values.uri }}
                imageSource={{ uri: values.uri }}
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
            disabled
          />
        </View>
        <View style={styling.row}>
          <Field
            {...Validation.getInputTypeProps('payment')}
            name="payment"
            component={TextField}
            placeholder={t('$ USD')}
          />
        </View>
      </CollapsableComponent>

      <CollapsableComponent
        style={styling.input}
        title={t('Lifetime')}
        helper={t('Change post expiry, set expiry to 1 day to post story')}
        active
      >
        <Field
          name="lifetime"
          accessibilityLabel="lifetime"
          label={t('Post will be available {{lifetime}}', { lifetime: lifetime.getLabel(values.lifetime) })}
          desc="All posts become stories when they are 24 hours from expiring"
          options={lifetime.options}
          component={SliderField}
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
          label: t('Share'),
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
        <DefaultButton label={t('Save')} onPress={handleSubmit} loading={loading} disabled={loading} />
      </View>
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
  row: {
    marginBottom: 12,
  },
})

PostEditForm.propTypes = {
  theme: PropTypes.any,
  handleSubmit: PropTypes.any,
  postEdit: PropTypes.any,
  t: PropTypes.any,
  values: PropTypes.any,
  loading: PropTypes.any,
  handlePostPress: PropTypes.any,
  setFieldValue: PropTypes.any,
  formAlbums: PropTypes.any,
  albumsGet: PropTypes.any,
  coinsOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
}

PostEditForm.defaultProps = {
  coinsOptions: [],
}

export default withTranslation()(withTheme(({
  postsEdit,
  postsEditRequest,
  postsSingleGet,
  ...props
}) => {
  const handleSubmit = (values) => {
    const keywords = joinTags(searchTags(values.text), values.keywords)
    postsEditRequest(normalizeValues({ ...values, keywords }))
  }

  return (
    <Formik
      initialValues={{
        postType: postsSingleGet.data.postType,
        postId: postsSingleGet.data.postId,
        uri: path(['image', 'url1080p'])(postsSingleGet.data),
        text: postsSingleGet.data.text,
        payment: String(postsSingleGet.data.payment),
        paymentTicker: postsSingleGet.data.paymentTicker,
        commentsDisabled: postsSingleGet.data.commentsDisabled,
        likesDisabled: postsSingleGet.data.likesDisabled,
        sharingDisabled: postsSingleGet.data.sharingDisabled,
        lifetime: lifetime.getValueByDate(postsSingleGet.data.expiresAt),
        albumId: path(['album', 'albumId'])(postsSingleGet.data),
        keywords: postsSingleGet.data.keywords,
      }}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <PostEditForm
          {...formikProps}
          {...props}
          loading={postsEdit.status === 'loading'}
        />
      )}
    </Formik>
  )
}))
