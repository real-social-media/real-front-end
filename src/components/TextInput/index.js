import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { withTheme, TextInput as RNTextInput } from 'react-native-paper'

const TextInput = ({ theme, style, ...props }) => {
  return (
    <RNTextInput
      {...props}
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
  theme: PropTypes.any,
  style: PropTypes.object,
}

TextInput.defaultProps = {
  style: null,
}

export default withTheme(TextInput)
