import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import * as navigationActions from 'navigation/actions'
import color from 'color'
import { useNavigation } from '@react-navigation/native'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const Placeholder = ({ t, theme, paymentTicker }) => {
  const styling = styles(theme)
  const navigation = useNavigation()
  const navigateSearch = () => navigationActions.navigateSearch(navigation)

  return (
    <View style={styling.root} accessibilityLabel="Empty State">
      <View style={styling.header}>
        <Text style={styling.title}>{t('The {{paymentTicker}} Coin is currently empty', {paymentTicker})}</Text>
        <Text style={styling.subtitle}>{t('Check back later')}</Text>
      </View>
      <View style={styling.actions}>
        <DefaultButton
          style={styling.settingsBtn}
          label={t('Explore other posts')}
          onPress={navigateSearch}
        />
        <Text style={styling.emptyText}>{t('Pull down to refresh')}</Text>
      </View>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.base * 2,
    },
    header: {
      marginBottom: theme.spacing.base * 2,
    },
    settingsBtn: {
      marginBottom: theme.spacing.base,
    },
    title: {
      fontSize: 21,
      fontWeight: '600',
      marginBottom: 6,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '400',
      color: color(theme.colors.text).fade(0.4).string(),
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      fontWeight: '300',
      textAlign: 'center',
      color: theme.colors.placeholder,
    },
  })

Placeholder.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  paymentTicker: PropTypes.string,
}

export default withTranslation()(withTheme(Placeholder))
