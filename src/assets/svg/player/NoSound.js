import React from 'react'
import PropTypes from 'prop-types'
import Svg, { G, Polyline, Line } from 'react-native-svg'

const NoSound = ({ size = 24, fill = '#333' }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <G fill={fill} stroke={fill} strokeLinecap="round" strokeWidth="1.5" transform="translate(0.5 0.5)">
      <Polyline fill="none" points="18,11 18,22 11.813,17.36 " stroke={fill} />
      <Polyline fill="none" points="8,16 2,16 2,8 10,8 18,2 18,6 " stroke={fill} />
      <Line fill="none" x1="23" x2="1" y1="1" y2="23"/>
    </G>
  </Svg>
)

NoSound.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
}
export default NoSound
