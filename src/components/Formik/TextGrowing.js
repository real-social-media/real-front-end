import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native'

import { withTheme } from 'react-native-paper'

const TextGrowing = ({
  theme,
  field: {
    value,
    name,
  },
  form,
  placeholder,
  multiline = true,
  keyboardType = 'default',
  onSubmitEditing,
  disabled,
  inputRef,
  onKeyPress,
}) => {
  const styling = styles(theme)

  const [height, setHeight] = useState(42)

  /**
   * Prevent too much multiline characters
   * - no more than 4 lines
   * - sequential lines will be replaces by single line
   */
  const onChangeText = (event) => {
    const newlines = event.match(/(\r\n|\n|\r)/gm) || []
    if (newlines.length > 5) return
    form.handleChange(name)(event.replace(/(\n\n|\r\r|\r\n\r\n)/gm, '\n'))
  }

  return (
    <View style={styling.root}>
      <TextInput
        ref={inputRef}
        style={[styling.input, { height }]}
        name={name}
        onChangeText={onChangeText}
        onBlur={form.handleBlur(name)}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        autoCapitalize="none"
        multiline={multiline}
        keyboardType={keyboardType}
        onSubmitEditing={onSubmitEditing}
        mode="outlined"
        dense={true}
        label={placeholder}
        disabled={disabled}
        maxLength={255}
        scrollEnabled={true}
        onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
        onKeyPress={onKeyPress}
      />
    </View>
  )
}

const styles = theme => StyleSheet.create({
  input: {
    minHeight: 42,
    padding: 12,
    lineHeight: 23,
    fontSize: 14,
    color: theme.colors.text,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: theme.colors.border,
  },
})

TextGrowing.propTypes = {
  theme: PropTypes.any,
  field: PropTypes.any,
  form: PropTypes.any,
  placeholder: PropTypes.any,
  meta: PropTypes.any,
  multiline: PropTypes.any,
  keyboardType: PropTypes.any,
  onSubmitEditing: PropTypes.any,
  disabled: PropTypes.any,
  inputRef: PropTypes.any,
  onKeyPress: PropTypes.func,
}

export default withTheme(TextGrowing)
