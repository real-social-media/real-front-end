import path from 'ramda/src/path'
import assocPath from 'ramda/src/assocPath'
import * as normalizer from 'normalizer/schemas'
import { entitiesSelector } from 'store/ducks/entities/selectors'
import { createDeepEqualSelector } from 'store/helpers'

/**
 *
 */
const chatGetChat = () => path(['chat', 'chatGetChat'])
export const chatGetChatSelector = (chatId) => createDeepEqualSelector(
  [chatGetChat(), entitiesSelector],
  (chatGetChat, entities) => {
    const denormalized = normalizer.denormalizeChatGet(chatId, entities)
    return assocPath(['data'], denormalized)(chatGetChat)
  },
)

/**
 *
 */
const chatGetChats = () => path(['chat', 'chatGetChats'])
export const chatGetChatsSelector = createDeepEqualSelector(
  [chatGetChats(), entitiesSelector],
  (chatGetChats, entities) => {
    const denormalized = normalizer.denormalizeChatsGet(chatGetChats.data, entities)
    return assocPath(['data'], denormalized)(chatGetChats)
  },
)


/**
 *
 */
const chatCreateDirect = () => path(['chat', 'chatCreateDirect'])
export const chatCreateDirectSelector = (chatId) => createDeepEqualSelector(
  [chatCreateDirect(), entitiesSelector],
  (chatCreateDirect, entities) => {
    const denormalized = normalizer.denormalizeChatGet(chatId, entities)
    return assocPath(['data'], denormalized)(chatCreateDirect)
  },
)
