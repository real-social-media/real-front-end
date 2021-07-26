import * as React from 'react'
import PropTypes from 'prop-types'
import Svg, { G, Circle, Path } from 'react-native-svg'

function Add({ fill, ...props }) {
  return (
    <Svg height={16} viewBox="0 0 16 16" width={16} xmlns="http://www.w3.org/2000/svg" {...props}>
      <G fill="none" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
        <Circle cx={8.5} cy={8.5} r={7} />
        <Path d="M8.5 4.5v8M4.5 8.5h8" />
      </G>
    </Svg>
  )
}

Add.propTypes = {
  fill: PropTypes.string,
}

Add.defaultProps = {
  fill: '#333',
}

export default Add
