export const imageFragment = `
  fragment imageFragment on Image {
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
`

export const userFragment = `
  fragment rootUser on User {
    userId
    username

    datingStatus
    userStatus
    dateOfBirth
    gender
    location {
      latitude
      longitude
      accuracy
    }
    height
    matchAgeRange {
      min
      max
    }
    matchHeightRange {
      min
      max
    }
    matchGenders
    matchLocationRadius

    photo {
      ...imageFragment
    }
    privacyStatus
    followedStatus
    followerStatus
    followedsCount
    followersCount
    followCountsHidden
    viewCountsHidden
    commentsDisabled
    likesDisabled
    sharingDisabled
    verificationHidden
    postCount
    fullName
    displayName
    themeCode
    bio
    email
    phoneNumber
    languageCode
    signedUpAt
    postViewedByCount
    blockedStatus
    blockerStatus
    subscriptionLevel
  }

  fragment userFragment on User {
    ...rootUser

    stories (limit: 12) {
      items {
        postId
        postStatus
        postType
        postedAt
        postedBy {
          ...rootUser
        }
        expiresAt
        text
        textTaggedUsers {
          tag
          user {
            ...rootUser
          }
        }
        image {
          ...imageFragment
        }
        isVerified
        likeStatus
        onymousLikeCount
        anonymousLikeCount
        viewedByCount
      }
      nextToken
    }

    directChat {
      chatId
    }
  }

  ${imageFragment}
`

export const commentFragment = `
  fragment commentFragment on Comment {
    commentId
    commentedAt
    commentedBy {
      ...userFragment
    }
    text
    textTaggedUsers {
      tag
      user {
        ...userFragment
      }
    }
  }
  ${userFragment}
`

export const postFragment = `
  fragment rootPost on Post {
    postId
    postStatus
    postType
    postedAt
    postedBy {
      ...userFragment
    }
    expiresAt
    text
    textTaggedUsers {
      tag
      user {
        ...userFragment
      }
    }
    image {
      ...imageFragment
    }
    imageUploadUrl
    isVerified
    likeStatus
    commentsCount
    commentsUnviewedCount: commentsCount(viewedStatus: NOT_VIEWED)
    commentsDisabled
    likesDisabled
    sharingDisabled
    verificationHidden
    onymousLikeCount
    anonymousLikeCount
    viewedByCount
    viewedStatus
    payment
    keywords
  }

  fragment postFragment on Post {
    ...rootPost
    originalPost {
      postId
      isVerified
      postedBy {
        ...userFragment
      }
    }
    onymouslyLikedBy (limit: 1) {
      items {
        ...userFragment
      }
      nextToken
    }
    comments (limit: 3) {
      items {
        ...commentFragment
      }
    }
    album {
      albumId
      createdAt
      ownedBy {
        ...userFragment
      }
      name
      description
      art {
        ...imageFragment
      }
      postCount
      postsLastUpdatedAt
      posts(limit: 10) {
        items {
          ...rootPost
        }
        nextToken
      }
    }
  }
  ${commentFragment}
`

export const albumFragment = `
  fragment albumFragment on Album {
    albumId
    createdAt
    ownedBy {
      ...userFragment
    }
    name
    description
    posts(limit: 10) {
      items {
        ...postFragment
      }
      nextToken
    }
    art {
      ...imageFragment
    }
    postCount
    postsLastUpdatedAt
  }
  ${postFragment}
`

export const chatMessageFragment = `
  fragment chatMessageFragment on ChatMessage {
    messageId
    text
    textTaggedUsers {
      tag
      user {
        ...userFragment
      }
    }
    createdAt
    lastEditedAt
    author {
      ...userFragment
    }
    viewedStatus
  }
  ${userFragment}
`

export const chatFragment = `
  fragment rootChatFragment on Chat {
    chatId
    chatType
    name
    createdAt
    lastMessageActivityAt
    usersCount
  }

  fragment chatFragment on Chat {
    ...rootChatFragment
    users(limit: 10) {
      items {
        ...userFragment
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
  ${chatMessageFragment}
`

export const cardFragment = `
  fragment cardFragment on Card {
    cardId
    title
    subTitle
    action
    thumbnail {
      ...imageFragment
    }
  }

  ${imageFragment}
`
