import React from 'react'
import PropTypes from 'prop-types'
import propOr from 'ramda/src/propOr'
import find from 'ramda/src/find'
import compose from 'ramda/src/compose'
import propEq from 'ramda/src/propEq'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select'
import { ErrorMessage } from 'formik'
import TextInput from 'components/TextInput'

const getDisplayValue = (value, options) => compose(propOr('', 'label'), find(propEq('value', value)))(options)

const PickerField = ({
  form,
  field,
  hideError,
  items,
  label,
  accessibilityLabel,
  disabled,
  ...props
}) => {
  const onFocus = () => {
    form.setFieldTouched(field.name, true)
    props.handleFieldFocus && props.handleFieldFocus()
  }

  const onBlur = () => {
    form.setFieldTouched(field.name, false)
    props.handleFieldBlur && props.handleFieldBlur()
  }

  const onChangeText = (value) => {
    form.setFieldValue(field.name, value)
  }

  return (
    <View>
      <RNPickerSelect
        {...props}
        items={items}
        onValueChange={onChangeText}
        onOpen={onFocus}
        onClose={onBlur}
        onDonePress={onBlur}
        value={field.value}
        disabled={disabled}
      >
        <TextInput
          label={label}
          value={getDisplayValue(field.value, items)}
          editable={false}
          accessibilityLabel={accessibilityLabel}
          disabled={disabled}
        />
      </RNPickerSelect>

      {!hideError ? <ErrorMessage name={field.name} render={(msg) => <Text style={styles.error}>{msg}</Text>} /> : null}
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

PickerField.propTypes = {
  field: PropTypes.any,
  form: PropTypes.any,
  placeholder: PropTypes.any,
  meta: PropTypes.any,
  disabled: PropTypes.bool,
  hideError: PropTypes.any,
  testID: PropTypes.any,
  handleFieldFocus: PropTypes.func,
  handleFieldBlur: PropTypes.func,
  items: PropTypes.array,
  label: PropTypes.string,
  accessibilityLabel: PropTypes.string,
}

PickerField.defaultProps = {
  disabled: false,
  handleFieldFocus: () => {},
  handleFieldBlur: () => {},
  items: [],
  label: null,
  accessibilityLabel: null,
}

export default PickerField
