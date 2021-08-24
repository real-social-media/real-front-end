import { useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import { useScrollToTop } from '@react-navigation/native'
import * as postsSelector from 'store/ducks/posts/selectors'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useEffectWhenFocused } from 'services/hooks'

const CoinPostsService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const postsByCoin = useSelector(postsSelector.postsByCoinSelector)
  const paymentTicker = route?.params?.paymentTicker

  const loadInit = useCallback((payload) => {
    dispatch(postsActions.postsByCoinRequest(payload))
  }, [])

  const postsByCoinMoreRequest = useCallback((payload) => {
    dispatch(postsActions.postsByCoinMoreRequest(payload))
  }, [])

  useEffectWhenFocused(() => {
    navigation.setOptions({ title: `${paymentTicker} Coin` })
  }, [paymentTicker])

  useEffectWhenFocused(() => {
    loadInit({ paymentTicker })

    return () => dispatch(postsActions.postsByCoinIdle())
  }, [])

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
   * FlatList feed ref, used for scroll to top on tab bar press
   */
  const feedRef = useRef(null)
  useScrollToTop(feedRef)

  /**
   * Post header dropdown ref, used for header actions dropdown
   */
  const actionSheetRefs = useRef({})

  /**
   * Text only post ref, used for rendering textonly post component into image
   */
  const textPostRefs = useRef({})

  const createActionSheetRef = useCallback(
    (post) => (element) => {
      if (!actionSheetRefs.current[post.postId]) {
        actionSheetRefs.current[post.postId] = element
      }
    },
    [],
  )

  const getActionSheetRef = useCallback((post) => actionSheetRefs.current[post.postId], [])

  const createTextPostRef = useCallback(
    (post) => (element) => {
      if (!textPostRefs.current[post.postId]) {
        textPostRefs.current[post.postId] = element
      }
    },
    [],
  )

  const getTextPostRef = useCallback((post) => textPostRefs.current[post.postId], [])

  return children({
    paymentTicker,
    postsByCoin,
    loadInit,
    postsByCoinMoreRequest,
    handleScrollPrev,
    handleScrollNext,
    feedRef,
    createActionSheetRef,
    getActionSheetRef,
    createTextPostRef,
    getTextPostRef,
  })
}

export default CoinPostsService
