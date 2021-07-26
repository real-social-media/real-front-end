import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import * as constants from 'store/ducks/entities/constants'

const now = Date.now()

export const initialState = {
  albums: {
    updatedAt: now,
  },
  posts: {
    updatedAt: now,
  },
  comments: {
    updatedAt: now,
  },
  users: {
    updatedAt: now,
  },
  chats: {
    updatedAt: now,
  },
  messages: {
    updatedAt: now,
  },
}

const innerMerge = (state, action) => {
  const entries = Object.entries(action.payload.data)

  return entries.reduce((acc, [key, value]) => {
    acc[key] = ({ ...acc[key] || {}, ...value })
    return acc
  }, state)
}

const createMergeReducer = (key) => (state, action) => update(state, {
  [key]: {
    $merge: innerMerge(state[key], action),
    updatedAt: { $set: Date.now() },
  },
})

const entitiesAlbumsMerge = createMergeReducer('albums')
const entitiesPostsMerge = createMergeReducer('posts')
const entitiesCommentsMerge = createMergeReducer('comments')
const entitiesUsersMerge = createMergeReducer('users')
const entitiesChatsMerge = createMergeReducer('chats')
const entitiesMessagesMerge = createMergeReducer('messages')

export default handleActions({
  [constants.ENTITIES_ALBUMS_MERGE]: entitiesAlbumsMerge,
  [constants.ENTITIES_POSTS_MERGE]: entitiesPostsMerge,
  [constants.ENTITIES_COMMENTS_MERGE]: entitiesCommentsMerge,
  [constants.ENTITIES_USERS_MERGE]: entitiesUsersMerge,
  [constants.ENTITIES_CHATS_MERGE]: entitiesChatsMerge,
  [constants.ENTITIES_MESSAGES_MERGE]: entitiesMessagesMerge,
}, initialState)
