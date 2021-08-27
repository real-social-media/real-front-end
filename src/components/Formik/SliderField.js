import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { Text, Caption } from 'react-native-paper'
import { ErrorMessage } from 'formik'
import Slider from 'components/Slider'

const SliderField = ({ form, field, label, desc, options }) => {
  const onChange = (value) => form.setFieldValue(field.name, value)

  return (
    <View>
      <Text>{label}</Text>
      <Caption>{desc}</Caption>
      <Slider onChange={onChange} value={field.value} options={options} />
      <ErrorMessage name={field.name} render={(msg) => <Text style={styles.error}>{msg}</Text>} />
    </View>
  )
}

const styles = StyleSheet.create({
  error: {
    textAlign: 'right',
    fontSize: 11,
    color: 'red',
  },
})

SliderField.propTypes = {
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  form: PropTypes.any,
  field: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
    }),
  ),
}

SliderField.defaultProps = {
  options: [],
}

export default SliderField
