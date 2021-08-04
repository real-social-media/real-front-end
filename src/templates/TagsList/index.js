import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import { withTheme } from 'react-native-paper'
import AddIcon from 'assets/svg/tags/Add'
import CheckIcon from 'assets/svg/tags/Check'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export const a11y = {
  option: 'Autosuggest Tag',
  addIcon: 'Add Tag Icon',
  removeIcon: 'Remove Tag Icon',
}

const TagsList = ({ theme, options, value, onPress, loading }) => {
  const styling = styles(theme)

  return (
    <KeyboardAwareScrollView
      style={styling.root}
      refreshControl={<RefreshControl tintColor={theme.colors.border} refreshing={loading} />}
    >
      {options.map((option) => {
        const isSelected = value.indexOf(option) !== -1

        return (
          <TouchableOpacity
            key={option}
            style={styling.option}
            accessibilityLabel={a11y.option}
            onPress={() => onPress(option, { isSelected })}
          >
            <Text style={styling.label}>#{option}</Text>
            {isSelected ? (
              <CheckIcon accessibilityLabel={a11y.removeIcon} fill={theme.colors.primary} />
            ) : (
              <AddIcon accessibilityLabel={a11y.addIcon} />
            )}
          </TouchableOpacity>
        )
      })}
    </KeyboardAwareScrollView>
  )
}

TagsList.propTypes = {
  theme: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.arrayOf(PropTypes.string),
  onPress: PropTypes.func,
  loading: PropTypes.bool,
}

TagsList.defaultProps = {
  options: [],
  value: [],
  onPress: () => {},
  loading: false,
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: 12,
    },
    option: {
      paddingVertical: 12,
      paddingHorizontal: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    label: {
      fontSize: 14,
    },
  })

export default withTheme(TagsList)
