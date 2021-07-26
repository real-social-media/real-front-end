import { normalize, denormalize, schema } from 'normalizr'

/**
 *
 */
const userSchema = new schema.Entity(
  'users',
  {},
  {
    idAttribute: 'userId',
  },
)

/**
 *
 */
const postSchema = new schema.Entity(
  'posts',
  {},
  { idAttribute: 'postId' },
)

/**
 *
 */
const chatSchema = new schema.Entity(
  'chats',
  {},
  {
    idAttribute: 'chatId',
  },
)

/**
 *
 */
const commentSchema = new schema.Entity(
  'comments',
  {},
  {
    idAttribute: 'commentId',
  },
)

/**
 *
 */
const albumSchema = new schema.Entity(
  'albums',
  {},
  {
    idAttribute: 'albumId',
  },
)

// const [userSchema] = [userSchema]
// const [postSchema] = [postSchema]
// const [commentSchema] = [commentSchema]
// const [albumSchema] = [albumSchema]
// const [messageSchema] = [messageSchema]
// const [chatSchema] = [chatSchema]

/**
 *
 */
const messageSchema = new schema.Entity(
  'messages',
  {},
  {
    idAttribute: 'messageId',
  },
)

commentSchema.define({
  commentedBy: userSchema,
  textTaggedUsers: [{
    user: userSchema,
  }],
})

albumSchema.define({
  ownedBy: userSchema,
  posts: {
    items: [postSchema],
  },
})

messageSchema.define({
  textTaggedUsers: [{
    user: userSchema,
  }],
  author: userSchema,
})

chatSchema.define({
  users: {
    items: [userSchema],
  },
  messages: {
    items: [messageSchema],
  },
})

postSchema.define({
  album: albumSchema,
  postedBy: userSchema,
  textTaggedUsers: [{
    user: userSchema,
  }],
  comments: {
    items: [commentSchema],
  },
})

userSchema.define({
  stories: {
    items: [postSchema],
  },
  posts: {
    items: [postSchema],
  },
})


/**
 *
 */
export function normalizePostsGet(payload) {
  return normalize(payload, [postSchema])
}

export function denormalizePostsGet(payload, entities) {
  return denormalize(payload, [postSchema], entities)
}

export function normalizePostGet(payload) {
  return normalize(payload, postSchema)
}

export function denormalizePostGet(payload, entities) {
  return denormalize(payload, postSchema, entities)
}

/**
 *
 */
export function normalizeCommentsGet(payload) {
  return normalize(payload, [commentSchema])
}

export function denormalizeCommentsGet(payload, entities) {
  return denormalize(payload, [commentSchema], entities)
}

export function normalizeCommentGet(payload) {
  return normalize(payload, [commentSchema])
}

export function denormalizeCommentGet(payload, entities) {
  return denormalize(payload, [commentSchema], entities)
}

/**
 *
 */
export function normalizeUsersGet(payload) {
  return normalize(payload, [userSchema])
}

export function denormalizeUsersGet(payload, entities) {
  return denormalize(payload, [userSchema], entities)
}

export function normalizeUserGet(payload) {
  return normalize(payload, userSchema)
}

export function denormalizeUserGet(payload, entities) {
  return denormalize(payload, userSchema, entities)
}

/**
 *
 */
export function normalizeAlbumsGet(payload) {
  return normalize(payload, [albumSchema])
}

export function denormalizeAlbumsGet(payload, entities) {
  return denormalize(payload, [albumSchema], entities)
}

export function normalizeAlbumGet(payload) {
  return normalize(payload, albumSchema)
}

export function denormalizeAlbumGet(payload, entities) {
  return denormalize(payload, albumSchema, entities)
}

/**
 *
 */
export function normalizeChatsGet(payload) {
  return normalize(payload, [chatSchema])
}

export function denormalizeChatsGet(payload, entities) {
  return denormalize(payload, [chatSchema], entities)
}

export function normalizeChatGet(payload) {
  return normalize(payload, chatSchema)
}

export function denormalizeChatGet(payload, entities) {
  return denormalize(payload, chatSchema, entities)
}

