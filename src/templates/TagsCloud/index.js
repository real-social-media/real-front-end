import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'

export const a11y = {
  option: 'Hashtag',
  deleteBtn: 'Delete Button',
}

const TagsCloud = ({ accessibilityLabel, theme, options, onPress }) => {
  const styling = styles(theme)

  return (
    <View accessibilityLabel={accessibilityLabel} style={styling.root}>
      {options.map((option) => (
        <View key={option} style={styling.option} accessibilityLabel={a11y.option}>
          <Text style={styling.label}>#{option}</Text>
          <TouchableOpacity onPress={() => onPress(option)} accessibilityLabel={a11y.deleteBtn}>
            <Text style={styling.deleteBtnText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

TagsCloud.propTypes = {
  theme: PropTypes.any.isRequired,
  accessibilityLabel: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  onPress: PropTypes.func,
}

TagsCloud.defaultProps = {
  options: [],
  onPress: () => {},
  accessibilityLabel: null,
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexShrink: 0,
    },
    option: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.backgroundSecondary,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: 'row',
      flexShrink: 0,
    },
    label: {
      color: theme.colors.disabled,
      marginRight: 5,
    },
    deleteBtnText: {
      fontSize: 18,
      lineHeight: 19,
      color: theme.colors.disabled,
    },
  })

export default withTheme(TagsCloud)
