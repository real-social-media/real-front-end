import { useRef, useCallback } from 'react'

function useFeed() {
  const feedRef = useRef(null)

  const handleScrollPrev = useCallback(
    (index) => () => {
      try {
        feedRef.current.scrollToIndex({
          index: index - 1,
          viewPosition: 0.5,
        })
      } catch (error) {
        // ignore
      }
    },
    [],
  )

  const handleScrollNext = useCallback(
    (index) => () => {
      try {
        feedRef.current.scrollToIndex({
          index: index + 1,
          viewPosition: 0.5,
        })
      } catch (error) {
        // ignore
      }
    },
    [],
  )

  /**
   * Post header dropdown ref, used for header actions dropdown
   */
  const actionSheetRefs = useRef({})

  const createActionSheetRef = useCallback(
    (post) => (element) => {
      if (!actionSheetRefs.current[post.postId]) {
        actionSheetRefs.current[post.postId] = element
      }
    },
    [],
  )

  const getActionSheetRef = useCallback((post) => actionSheetRefs.current[post.postId], [])

  /**
   * Text only post ref, used for rendering textonly post component into image
   */
  const textPostRefs = useRef({})

  const createTextPostRef = useCallback(
    (post) => (element) => {
      if (!textPostRefs.current[post.postId]) {
        textPostRefs.current[post.postId] = element
      }
    },
    [],
  )

  const getTextPostRef = useCallback((post) => textPostRefs.current[post.postId], [])

  return {
    feedRef,
    handleScrollPrev,
    handleScrollNext,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  }
}

export default useFeed
