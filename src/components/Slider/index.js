/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Caption } from 'react-native-paper'
import RNSlider from '@react-native-community/slider'
import { withTheme } from 'react-native-paper'

const marginHorizontal = 14

export const a11y = {
  slider: 'Range slider',
  option: 'Range slider option',
}

const Slider = ({ theme, onChange, options, value }) => {
  const styling = styles(theme)
  const minimumValue = 0
  const maximumValue = options.length - 1
  const valueIndex = options.findIndex((item) => item.value === value) || minimumValue
  const onValueChange = (index) => onChange(options[index].value)

  return (
    <View>
      <RNSlider
        accessibilityLabel={a11y.slider}
        style={styling.slider}
        step={1}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.disabled}
        value={valueIndex}
        onValueChange={onValueChange}
      />

      <View style={styling.sliderIndicator}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={item.value}
            accessibilityLabel={a11y.option}
            onPress={() => onValueChange(index)}
            style={[
              styling.indicator,
              index === minimumValue ? { alignItems: 'flex-start', left: marginHorizontal * -1 } : null,
              index === maximumValue ? { alignItems: 'flex-end', right: marginHorizontal * -1 } : null,
            ]}
          >
            <Caption style={styling.caption}>{item.label}</Caption>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    slider: {
      height: 30,
      marginTop: theme.spacing.base,
    },
    sliderIndicator: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 20,
      marginHorizontal,
      marginBottom: 6,
    },
    indicator: {
      width: 0,
      position: 'relative',
      alignItems: 'center',
    },
    caption: {
      position: 'absolute',
      color: theme.colors.border,
    },
    error: {
      textAlign: 'right',
      fontSize: 11,
      color: 'red',
    },
  })

Slider.propTypes = {
  theme: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ),
}

Slider.defaultProps = {
  options: [],
}

export default withTheme(Slider)
