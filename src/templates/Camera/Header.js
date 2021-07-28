import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import CloseIcon from 'assets/svg/camera/Close'
import * as navigationActions from 'navigation/actions'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import secondsToDuration from 'services/helpers/secondsToDuration'

const Header = ({
  theme,
  content,
  recordedDuration,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  return (
    <View style={styling.root}>
      {recordedDuration > 0 ? (
        <View style={styling.timerWrapper}>
          <Text style={styling.timerText}>{secondsToDuration(recordedDuration)}</Text>
        </View>
      ) : null}

      {content !== undefined ? (
        <View style={styling.content}>
          {content}
        </View>
      ) : null}

      <View style={styling.action}>
        <View style={styling.actionItem} />
        <TouchableOpacity style={styling.actionItem} onPress={() => navigationActions.navigateBack(navigation)}>
          <CloseIcon
            fill={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 3,
    paddingHorizontal: theme.spacing.base,
  },
  action: {
    flex: 1,
    margin: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionItem: {
    paddingHorizontal: theme.spacing.base,
  },
  timerWrapper: {
    position: 'absolute',
    zIndex: 2,
  },
  timerText: {
    color: '#fff',
    textAlign: 'center',
  },
})

Header.propTypes = {
  theme: PropTypes.any,
  content: PropTypes.any,
  recordedDuration: PropTypes.number,
}

export default withTheme(Header)
