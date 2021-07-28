import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native'
import UploadIcon from 'assets/svg/camera/Upload'
import FlipIcon from 'assets/svg/camera/Flip'
import FlashOnIcon from 'assets/svg/camera/FlashOn'
import FlashOffIcon from 'assets/svg/camera/FlashOff'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

import { withTheme } from 'react-native-paper'
import { MAX_VIDEO_RECORD_DURATION } from 'store/ducks/player/constants'

const Shutter = ({
  theme,
  flashMode,
  handleFlipToggle,
  handleLibrarySnap,
  handleCameraSnap,
  handleVideoRecord,
  onRecordingEnd,
  handleFlashToggle,
  recordedDuration,
  shutterButtonScaleRef,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <View style={styling.action}>
        <TouchableOpacity style={styling.item} onPress={handleLibrarySnap}>
          <UploadIcon
            fill="#ffffff"
          />
        </TouchableOpacity>
        <View style={styling.item} />

        <Pressable
          onPress={handleCameraSnap}
          onLongPress={handleVideoRecord}
          onPressOut={onRecordingEnd}
        >
          <Animated.View
            style={[styling.capture, styling.shutterButtonScale(shutterButtonScaleRef.current)]}
          >
            <AnimatedCircularProgress
              size={80}
              width={10}
              fill={recordedDuration * 100 / MAX_VIDEO_RECORD_DURATION}
              tintColor="#e74c3c"
            />
          </Animated.View>
        </Pressable>

        <TouchableOpacity style={styling.item} onPress={handleFlipToggle}>
          <FlipIcon
            fill="#ffffff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styling.item} onPress={handleFlashToggle}>
          {flashMode ?
            <FlashOnIcon
              fill="#ffffff"
            />
          : null}

          {!flashMode ?
            <FlashOffIcon
              fill="#ffffff"
            />
          : null}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  item: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 10,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButtonScale: (shutterButtonScale) => ({
    transform: [
      {
        scale: shutterButtonScale,
      },
    ],
  }),
})

Shutter.propTypes = {
  theme: PropTypes.any,
  flashMode: PropTypes.any,
  handleFlipToggle: PropTypes.any,
  handleCameraSnap: PropTypes.any,
  handleFlashToggle: PropTypes.any,
  handleLibrarySnap: PropTypes.func,
  handleVideoRecord: PropTypes.func,
  onRecordingEnd: PropTypes.func,
  recordedDuration: PropTypes.func,
  shutterButtonScaleRef: PropTypes.any,
}

export default withTheme(Shutter)
