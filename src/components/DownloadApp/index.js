import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, SafeAreaView, StyleSheet, View, Linking } from 'react-native'
import { Text } from 'react-native-paper'
import DownloadIcon from 'assets/svg/other/Download'
import AppStoreIcon from 'assets/svg/other/AppStore'
import color from 'color'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import * as LinkingService from 'services/Linking'

const DownloadApp = ({ t, theme, handleClose }) => {
  const styling = styles(theme)
  const navigateToAppStore = () => Linking.openURL(LinkingService.getStoreLink())

  return (
    <View style={styling.root}>
      <TouchableOpacity style={styling.backdrop} onPress={handleClose} />

      <SafeAreaView style={styling.component}>
        <View style={styling.heading}>
          <View style={styling.info}>
            <DownloadIcon fill={theme.colors.text} />
          </View>
          <Text style={styling.headingTitle}>{t('Please download the app to continue')}</Text>
          <Text style={styling.headingSubtitle}>{t('The Healthier Social Media Movement')}</Text>
          <TouchableOpacity style={styling.closeBtn} onPress={handleClose}>
            <Text>{t('Close')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styling.footer}>
          <TouchableOpacity onPress={navigateToAppStore}>
            <AppStoreIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
      position: 'relative',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(52, 52, 52, 0.5)',
    },
    closeBtn: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
    component: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    info: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    heading: {
      paddingHorizontal: 48,
      paddingVertical: 24,
    },
    headingTitle: {
      fontSize: 22,
      fontWeight: '600',
      paddingBottom: 6,
      textAlign: 'center',
    },
    headingSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      color: color(theme.colors.text).fade(0.4).string(),
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: theme.spacing.base * 2,
      marginBottom: theme.spacing.base * 2,
      alignItems: 'center',
    },
  })

DownloadApp.propTypes = {
  theme: PropTypes.any,
  t: PropTypes.any,
  handleClose: PropTypes.any,
}

export default withTranslation()(withTheme(DownloadApp))
