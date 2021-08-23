import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { withTheme, TextInput as RNTextInput } from 'react-native-paper'

const TextInput = ({ theme, style, disabled, ...props }) => {
  return (
    <RNTextInput
      {...props}
      disabled={disabled}
      style={[style, styles.input]}
      placeholderTextColor={theme.colors.placeholder}
      mode="outlined"
      dense
    />
  )
}

export const styles = StyleSheet.create({
  input: {
    padding: 0,
    margin: 0,
    fontSize: 14,
  },
})

TextInput.propTypes = {
  disabled: PropTypes.bool,
  theme: PropTypes.any,
  style: PropTypes.object,
}

TextInput.defaultProps = {
  style: null,
  disabled: false,
}

export default withTheme(TextInput)
