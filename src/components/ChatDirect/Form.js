import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  Keyboard,
} from 'react-native'
import TextGrowing from 'components/Formik/TextGrowing'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const formSchema = Yup.object().shape({
  text: Yup.string().min(1).required(),
})

const ChatDirectForm = ({
  t,
  theme,
  handleSubmit,
  loading,
}) => {
  const styling = styles(theme)

  const handleSubmitOnEnter = ({ nativeEvent }) => {
    if (nativeEvent.altKey && nativeEvent.key === 'Enter') {
      nativeEvent.preventDefault()
      handleSubmit()
    }
  }

  return (
    <View style={styling.root}>
      <View style={styling.input}>
        <Field
          name="text"
          component={TextGrowing}
          placeholder={t('Send a message')}
          onKeyPress={handleSubmitOnEnter}
          hideError
        />
      </View>
      <View style={styling.button}>
        <DefaultButton label={t('Send')} onPress={handleSubmit} loading={loading} disabled={loading} />
      </View>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flexDirection: 'row',
    minHeight: 64,
    padding: 12,
  },
  input: {
    flex: 1,
  },
  button: {
    width: 90,
    marginLeft: theme.spacing.base,
    justifyContent: 'flex-end',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
  },
})

ChatDirectForm.propTypes = {
  theme: PropTypes.any,
  handleSubmit: PropTypes.any,
  submitErrors: PropTypes.any,
  dirtySinceLastSubmit: PropTypes.any,
  loading: PropTypes.any,
  t: PropTypes.any,
}

export default withTranslation()(withTheme(({
  chatAddMessage,
  chatAddMessageRequest,
  ...props
}) => (
  <Formik
    initialValues={{
      text: '',
    }}
    validationSchema={formSchema}
    onSubmit={(values, { resetForm }) => {
      chatAddMessageRequest(values)
      resetForm()
      Keyboard.dismiss()
    }}
  >
    {(formikProps) => (
      <ChatDirectForm
        {...formikProps}
        {...props}
        loading={chatAddMessage.status === 'loading'}
      />
    )}
  </Formik>
)))
