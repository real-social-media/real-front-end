export const singleChatFragment = `
  fragment userImageFragment on Image {
    url
    url64p
    url480p
    url1080p
    url4k
    urlEla
    width
    height
    colors {
      r
      g
      b
    }
  }

  fragment chatUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
    photo {
      ...userImageFragment
    }
  }

  fragment chatMessageFragment on ChatMessage {
    messageId
    text
    createdAt
    lastEditedAt
    viewedStatus

    author {
      ...chatUserFragment
    }
    textTaggedUsers {
      tag
      user {
        ...chatUserFragment
      }
    }
  }

  fragment singleChatFragment on Chat {
    chatId
    chatType
    name
    createdAt
    lastMessageActivityAt
    usersCount

    users(limit: 10) {
      items {
        ...chatUserFragment
      }
      nextToken
    }

    messages(limit: 20, reverse: true) {
      items {
        ...chatMessageFragment
      }
      nextToken
    }
  }
`
