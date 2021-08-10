import { useRef } from 'react'
import { Keyboard } from 'react-native'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as postsActions from 'store/ducks/posts/actions'
import { useRoute } from '@react-navigation/native'
import { v4 as uuid } from 'uuid'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import * as authSelector from 'store/ducks/auth/selectors'
import * as postsSelector from 'store/ducks/posts/selectors'
import useViewable, { unpaid } from 'services/providers/Viewable'
import trim from 'ramda/src/trim'
import compose from 'ramda/src/compose'
import pathOr from 'ramda/src/pathOr'
import { useEffectWhenFocused } from 'services/hooks'

const CommentsService = ({ children }) => {
  const dispatch = useDispatch()
  const route = useRoute()
  const postId = route.params.postId
  const actionId = route.params.actionId
  const user = useSelector(authSelector.authUser)
  const commentsAdd = useSelector(state => state.posts.commentsAdd)
  const commentsDelete = useSelector(state => state.posts.commentsDelete)
  const commentsFlag = useSelector(state => state.posts.commentsFlag)
  const postsCommentsGet = useSelector(postsSelector.postsCommentsGetSelector(postId))
  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)

  const commentsRef = useRef()
  const formRef = useRef()

  const resetForm = () => {
    try {
      formRef.current.resetForm()

      setTimeout(() => {
        Keyboard.dismiss()
      }, 0)
    } catch(error) {
      // ignore
    }
  }

  useEffectWhenFocused(() => {
    const commentIndex = postsCommentsGet.data.findIndex(item => item.commentId === actionId)
    if (postsCommentsGet.status === 'success' && commentIndex !== -1) {
      commentsRef.current.scrollToIndex({ animated: false, index: commentIndex })
    }
  }, [postsCommentsGet.status])

  useEffect(() => {
    dispatch(postsActions.postsSingleGetRequest({ postId }))
    dispatch(postsActions.postsCommentsGetRequest({ postId }))
  }, [])

  useEffect(() => {
    if (postsSingleGet.status !== 'success') return
    if (unpaid(postsSingleGet.data)) return

    dispatch(postsActions.postsReportPostViewsRequest({ postIds: [postId], viewType: 'THUMBNAIL' }))
  }, [postsSingleGet.status])

  useEffectWhenFocused(() => {
    if (commentsAdd.status === 'success') {
      dispatch(postsActions.postsCommentsGetRequest({ postId }))
      dispatch(postsActions.postsSingleGetRequest({ postId }))
      dispatch(postsActions.commentsAddIdle({}))
      resetForm()
    }
  }, [commentsAdd.status])

  useEffectWhenFocused(() => {
    if (commentsDelete.status === 'success') {
      dispatch(postsActions.postsCommentsGetRequest({ postId }))
      dispatch(postsActions.postsSingleGetRequest({ postId }))
      dispatch(postsActions.commentsDeleteIdle({}))
    }
  }, [commentsDelete.status])

  useEffectWhenFocused(() => {
    if (commentsFlag.status === 'success') {
      dispatch(postsActions.postsCommentsGetRequest({ postId }))
      dispatch(postsActions.postsSingleGetRequest({ postId }))
      dispatch(postsActions.commentsFlagIdle({}))
    }
  }, [commentsFlag.status])

  const commentsAddRequest = ({ text }) => {
    const commentId = uuid()
    dispatch(postsActions.commentsAddRequest({
      commentId,
      postId,
      text,
    }))
  }

  const commentsDeleteRequest = (payload) =>
    dispatch(postsActions.commentsDeleteRequest(payload))

  const commentsFlagRequest = (payload) =>
    dispatch(postsActions.commentsFlagRequest(payload))

  /**
   * Keyboard movement calculator
   */
  const [offset, setOffset] = useState(0)

  const keyboardWillShow = (event) => {
    setOffset(event.endCoordinates.height - ifIphoneX(40, 0) + 12)
  }

  const keyboardWillHide = () => {
    setOffset(0)
  }

  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow)
    const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide)

    return () => {
      keyboardWillShowSub.remove()
      keyboardWillHideSub.remove()
    }
  }, [])

  const marginBottom = offset + ifIphoneX(40, 0)

  /**
   * FlatList feed config ref, used for reporting scroll events
   */
  const { onViewableItemsThumbnailsRef } = useViewable()
  const viewabilityConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 5,
    waitForInteraction: false,
  })

  /**
   *
   */
  const inputRefs = useRef({
    text: useRef(null),
  })

  const handleUserReply = (username) => {
    try {
      formRef.current.setFieldValue('text', `@${username} `)
      inputRefs.current.text.current.focus()
    } catch(error) {
      // ignore
    }
  }

  const handleFormSubmit = (values) => {
    commentsAddRequest(values)
  }

  const formSubmitLoading = commentsAdd.status === 'loading'
  const formSubmitDisabled = commentsAdd.status === 'loading'

  const formInitialValues = {
    text: '',
  }

  const handleFormTransform = (values) => ({
    text: compose(trim, pathOr('', ['text']))(values),
  })

  return children({
    user,
    commentsDeleteRequest,
    commentsFlagRequest,
    postsCommentsGet,
    postsSingleGet,
    marginBottom,
    onViewableItemsThumbnailsRef,
    viewabilityConfigRef,
    handleUserReply,
    commentsRef,

    handleFormSubmit,
    handleFormTransform,
    formSubmitLoading,
    formSubmitDisabled,
    formInitialValues,
    inputRefs,
    formRef,
  })
}

export default CommentsService
