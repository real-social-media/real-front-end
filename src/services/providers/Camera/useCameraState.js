import { useState } from 'react'
import { useSelector } from 'react-redux'
import useToggle from 'react-use/lib/useToggle'
import * as postsSelector from 'store/ducks/posts/selectors'

const useCameraState = () => {
  const postsCreate = useSelector(postsSelector.postsCreate)
  const [flashMode, handleFlashToggle] = useToggle(false)
  const [flipMode, handleFlipToggle] = useToggle(false)
  const [mediaSize, setMediaSize] = useState('4:3')
  const [recordedDuration, setRecordedDuration] = useState(0)

  return {
    postsCreate,
    flashMode,
    handleFlashToggle,
    flipMode,
    handleFlipToggle,
    mediaSize,
    setMediaSize,
    recordedDuration,
    setRecordedDuration,
  }
}

export default useCameraState
