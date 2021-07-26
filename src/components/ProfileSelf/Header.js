import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity, Linking } from 'react-native'
import { withTheme } from 'react-native-paper'

const formatPrice = (value) =>
  parseFloat(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

const HeaderRight = ({ theme, walletTotal }) => {
  const styling = styles(theme)
  const handlePress = () => Linking.openURL('https://real.app/apps/coins')

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styling.text}>{formatPrice(walletTotal)}</Text>
    </TouchableOpacity>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    text: {
      fontSize: 16,
      color: theme.colors.primary,
      paddingHorizontal: theme.spacing.base,
      fontWeight: '700',
      textAlign: 'right',
    },
  })

HeaderRight.propTypes = {
  theme: PropTypes.any,
  navigation: PropTypes.any,
  walletTotal: PropTypes.string,
}

HeaderRight.defaultProps = {
  walletTotal: '0',
}

export default withTheme(HeaderRight)
