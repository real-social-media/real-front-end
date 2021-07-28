import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import useLibrary from 'services/providers/Camera/useLibrary'
import useCamera from 'services/providers/Camera/useCamera'
import * as cameraActions from 'store/ducks/camera/actions'
import * as navigationActions from 'navigation/actions'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'
import { navigateToPath } from 'navigation/helpers'
import { mediaType } from 'services/providers/Camera/helpers'

const CameraService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const cameraRef = useRef(null)
  const multiple = pathOr(true, ['params', 'multiple'], route)

  /**
   *
   */
  const handleProcessedMedia = (payload) => {
    dispatch(cameraActions.cameraCaptureRequest(payload))
    const nextRoute = path(['params', 'nextRoute'])(route)
    const backRoute = path(['params', 'backRoute'])(route)
    const nextPayload = ({
      type: mediaType(payload[0].originalFormat),
      backRoute,
    })


    if (nextRoute) {
      navigateToPath(nextRoute)(navigation, nextPayload)
    } else {
      navigationActions.navigatePostCreate(navigation, nextPayload)
    }
  }

  const camera = useCamera({ handleProcessedMedia, cameraRef })
  const library = useLibrary({ handleProcessedMedia, multiple })

  return children({ ...camera, ...library })
}

export default CameraService
