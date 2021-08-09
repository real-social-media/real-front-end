import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import path from 'ramda/src/path'
import { getDimensionsFromPostSize } from 'services/Dimensions'
import PinchZoom from 'templates/ListItem/PinchZoom'
import LinearGradient from 'react-native-linear-gradient'

import { withTheme } from 'react-native-paper'

const ListItemTemplate = ({
  theme,
  children,
  post,
}) => {
  const styling = styles
  const image = path(['image'])(post)
  const color = path(['image', 'colors', 0])(post)

  if (!image) {
    return null
  }

  const primaryGradient = `rgb(${color.r}, ${color.g}, ${color.b})`

  return (
    <PinchZoom
      style={[styling.root, getDimensionsFromPostSize(image)]}
      image={image}
    >
      <LinearGradient
        colors={[`${primaryGradient}`, `${theme.colors.backgroundSecondary}50`]}
        style={styling.gradient}
      />

      <View style={styling.component}>
        <View style={styling.nested}>
          {children}
        </View>
      </View>
    </PinchZoom>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    zIndex: 10,
  },
  component: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  nested: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

ListItemTemplate.defaultProps = {
}

ListItemTemplate.propTypes = {
  theme: PropTypes.any,
  children: PropTypes.any,
  post: PropTypes.any,
}

export default withTheme(ListItemTemplate)
