import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, SafeAreaView, StyleSheet, View, Text, Platform } from 'react-native'
import { RESULTS } from 'react-native-permissions'
import TextIcon from 'assets/svg/types/Text'
import PhotoIcon from 'assets/svg/types/Photo'
import GalleryIcon from 'assets/svg/types/Gallery'
import { Subheading } from 'react-native-paper'
import color from 'color'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

export const a11y = {
  permission: 'permission',
}

const PostType = ({
  t,
  permission,
  theme,
  handleManageAccess,
  handleLibrarySnap,
  handlePhotoTab,
  handleTextPostTab,
  handleClose,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <TouchableOpacity testID={testIDs.backdrop} style={styling.backdrop} onPress={handleClose} />

      <SafeAreaView style={styling.component}>
        <TouchableOpacity style={styling.close} onPress={handleClose}>
          <Text style={styling.link}>{t('Close')}</Text>
        </TouchableOpacity>

        <View style={styling.types}>
          <TouchableOpacity style={styling.type} onPress={handlePhotoTab}>
            <View style={styling.icon}>
              <PhotoIcon fill={color(theme.colors.text).negate().string()} />
            </View>
            <Subheading style={styling.text}>{t('Photo')}</Subheading>
          </TouchableOpacity>
          <TouchableOpacity style={styling.type} onPress={handleLibrarySnap}>
            <View style={styling.icon}>
              <GalleryIcon fill={color(theme.colors.text).negate().string()} />
            </View>
            <Subheading style={styling.text}>{t('Gallery')}</Subheading>
          </TouchableOpacity>
          <TouchableOpacity style={styling.type} onPress={handleTextPostTab}>
            <View style={styling.icon}>
              <TextIcon fill={color(theme.colors.text).negate().string()} />
            </View>
            <Subheading style={styling.text}>{t('Text')}</Subheading>
          </TouchableOpacity>
        </View>

        {permission === RESULTS.LIMITED && (
          <TouchableOpacity
            accessibilityLabel={a11y.permission}
            style={styling.permission}
            onPress={handleManageAccess}
          >
            <Text style={styling.permissionText}>
              {t('You’ve given REAL access to only a select number of photos.')}{' '}
              <Text style={styling.link}>{t('Manage')}</Text>
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Platform.OS === 'web' ? 'rgba(52, 52, 52, 0.5)' : 'transparent',
    },
    component: {
      position: 'relative',
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundSecondary,
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    types: {
      paddingTop: 45,
      paddingHorizontal: 48,
      flexDirection: 'row',
      marginBottom: 21,
      justifyContent: 'space-between',
    },
    type: {
      paddingHorizontal: theme.spacing.base,
    },
    close: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 100,
    },
    icon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.text,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    text: {
      color: theme.colors.text,
      fontWeight: '500',
      alignSelf: 'center',
      fontSize: 14,
    },
    link: {
      color: theme.colors.primary,
    },
    permission: {
      marginHorizontal: 48,
    },
    permissionText: {
      color: color(theme.colors.text).fade(0.4).string(),
      fontSize: 14,
    },
  })

PostType.propTypes = {
  theme: PropTypes.any,
  t: PropTypes.any,
  handleLibrarySnap: PropTypes.func,
  handlePhotoTab: PropTypes.func,
  handleTextPostTab: PropTypes.func,
  handleClose: PropTypes.func,
  handleManageAccess: PropTypes.func,
  permission: PropTypes.string,
}

export default withTranslation()(withTheme(PostType))
