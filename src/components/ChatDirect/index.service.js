import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import * as chatActions from 'store/ducks/chat/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import { v4 as uuid } from 'uuid'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import * as chatSelector from 'store/ducks/chat/selectors'
import * as usersSelector from 'store/ducks/users/selectors'
import { useEffectWhenFocused } from 'services/hooks'

const ChatDirectService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()

  const chatId = route.params.chatId
  const userId = route.params.userId

  const user = useSelector(authSelector.authUser)
  const usersGetTrendingUsers = useSelector(usersSelector.usersGetTrendingUsersSelector)
  const chatCreateDirect = useSelector(state => state.chat.chatCreateDirect)
  const chatAddMessage = useSelector(state => state.chat.chatAddMessage)
  const chatFlagMessage = useSelector(state => state.chat.chatFlagMessage)
  const chatDeleteMessage = useSelector(state => state.chat.chatDeleteMessage)
  const chatGetChat = useSelector(chatSelector.chatGetChatSelector(chatId))

  const chatDeleteMessageRequest = (payload) =>
    dispatch(chatActions.chatDeleteMessageRequest(payload))

  const chatFlagMessageRequest = (payload) =>
    dispatch(chatActions.chatFlagMessageRequest(payload))

  useEffect(() => {
    if (!chatId) return

    dispatch(chatActions.chatGetChatRequest({ chatId }))
  }, [])

  useEffectWhenFocused(() => {
    if (chatDeleteMessage.status !== 'success') {
      return
    }

    dispatch(chatActions.chatDeleteMessageIdle({}))
    dispatch(chatActions.chatGetChatRequest({ chatId }))
  }, [chatDeleteMessage.status])

  useEffectWhenFocused(() => {
    if (chatFlagMessage.status !== 'success') {
      return
    }

    dispatch(chatActions.chatFlagMessageIdle({}))
  }, [chatFlagMessage.status])

  useEffectWhenFocused(() => {
    if (chatGetChat.status === 'success' && chatId) {
      dispatch(chatActions.chatReportViewRequest({ chatIds: [chatId] }))
    }
  }, [chatGetChat.status])

  useEffectWhenFocused(() => {
    if (chatAddMessage.status === 'success') {
      dispatch(chatActions.chatGetChatRequest({ chatId }))
      dispatch(chatActions.chatAddMessageIdle({}))
    }
  }, [chatAddMessage.status])

  useEffectWhenFocused(() => {
    if (chatCreateDirect.status === 'success') {
      navigation.setParams({ chatId: chatCreateDirect.payload.chatId })
      dispatch(chatActions.chatGetChatRequest({ chatId: chatCreateDirect.payload.chatId }))
      dispatch(chatActions.chatGetChatsRequest())
      dispatch(chatActions.chatCreateDirectIdle({}))
    }
  }, [chatCreateDirect.status])

  const chatCreateDirectRequest = ({ text }) => {
    const chatId = uuid()
    const messageId = uuid()
    dispatch(chatActions.chatCreateDirectRequest({
      chatId,
      userId,
      messageId,
      messageText: text,
    }))
  }

  const chatAddMessageRequest = (payload) => {
    const messageId = uuid()
    dispatch(chatActions.chatAddMessageRequest({
      chatId,
      messageId,
      text: payload.text,
    }))
  }

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

  return children({
    user,
    chatId,
    chatCreateDirect,
    chatAddMessage,
    chatAddMessageRequest,
    chatCreateDirectRequest,
    usersGetTrendingUsers,
    chatGetChat,
    marginBottom,
    chatDeleteMessageRequest,
    chatFlagMessageRequest,
  })
}

export default ChatDirectService
