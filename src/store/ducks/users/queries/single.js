export const singleUserFragment = `
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

  fragment singleUserFragment on User {
    userId
    username
    userStatus
    datingStatus
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
    chatsWithUnviewedMessagesCount
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
