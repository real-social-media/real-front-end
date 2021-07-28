import React from 'react'
import PropTypes from 'prop-types'
import Svg, { G, Path, Polygon } from 'react-native-svg'

const Sound = ({ size = 24, fill = '#333' }) => (
  <Svg height={size} width={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <G fill={fill} stroke={fill} strokeLinecap="round" strokeWidth="1.5" transform="translate(0.5 0.5)">
      <Polygon fill="none" points="14,22 6,16 1,16 1,8 6,8 14,2 " stroke={fill}/>
      <Path d="M17.5,15.5 c2-2,2-5.1,0-7.1" fill="none"/>
      <Path d="M20.4,18.4 c3.5-3.5,3.5-9.2,0-12.7" fill="none"/>
    </G>
  </Svg>
)

Sound.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
}

export default Sound
