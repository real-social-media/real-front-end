export const listUserFragment = `
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

  fragment userStoryUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
  }

  fragment userStoryFragment on Post {
    postId
    postStatus
    postType
    postedAt
    expiresAt
    text
    isVerified
    adStatus
    likeStatus
    onymousLikeCount
    anonymousLikeCount
    viewedByCount
    likesDisabled
    commentsDisabled
    sharingDisabled
    image {
      ...userImageFragment
    }
    postedBy {
      ...userStoryUserFragment
    }
  }

  fragment listUserFragment on User {
    userId
    username
    userStatus
    datingStatus
    privacyStatus
    followedStatus
    followerStatus
    followedsCount
    followersCount
    postCount
    fullName
    displayName
    themeCode
    signedUpAt
    blockedStatus
    blockerStatus
    subscriptionLevel

    photo {
      ...userImageFragment
    }

    stories (limit: 12) {
      items {
        ...userStoryFragment
      }
      nextToken
    }

    directChat {
      chatId
    }
  }
`
