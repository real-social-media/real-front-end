import React from 'react'
import { useIsFocused } from '@react-navigation/native'
import CameraComponent from 'components/Camera'
import CameraServiceComponent from 'components/Camera/index.service'
import PermissionsComponent from 'components/Permissions'
import PermissionsServiceComponent from 'components/Permissions/index.service'

class CameraScreen extends React.Component {
  render() {
    return (
      <PermissionsServiceComponent camera library>
        {(permissionsProps) => (
          <React.Fragment>
            {!permissionsProps.cameraEnabled || !permissionsProps.libraryEnabled ?
              <PermissionsComponent
                {...permissionsProps}
                camera
              />
            :
              <CameraServiceComponent>
                {(cameraProps) => (
                  <CameraComponent
                    {...cameraProps}
                    {...permissionsProps}
                  />
                )}
              </CameraServiceComponent>
            }
          </React.Fragment>
        )}
      </PermissionsServiceComponent>
    )
  }
}

export default function(props) {
  const isFocused = useIsFocused()

  return isFocused ? <CameraScreen {...props} /> : null
}
