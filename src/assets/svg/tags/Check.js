import * as React from 'react'
import PropTypes from 'prop-types'
import Svg, { G, Circle, Path } from 'react-native-svg'

function Check({ fill, ...props }) {
  return (
    <Svg height={16} viewBox="0 0 16 16" width={16} xmlns="http://www.w3.org/2000/svg" {...props}>
      <G fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
        <Circle cx={8} cy={8} r={7.5} />
        <Path d="M4.5 7.5L7 10l5-5" />
      </G>
    </Svg>
  )
}

Check.propTypes = {
  fill: PropTypes.string,
}

Check.defaultProps = {
  fill: '#333',
}

export default Check
