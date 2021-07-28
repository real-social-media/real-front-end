export const gridPostFragment = `
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

  fragment videoFragment on Video {
    urlMasterM3U8
    accessCookies {
      domain
      path
      expiresAt
      policy
      signature
      keyPairId
    }
    resolutions {
      width
      height
    }
  }

  fragment postUserFragment on User {
    userId
    username
    datingStatus
    viewCountsHidden
    commentsDisabled
    likesDisabled
    sharingDisabled
    verificationHidden
    fullName
    displayName
    themeCode
    bio
    blockedStatus
    blockerStatus
    subscriptionLevel

    photo {
      ...imageFragment
    }
  }

  fragment gridPostFragment on Post {
    postId
    isVerified
    adStatus
    postStatus
    postType
    postedAt
    payment
    keywords
    expiresAt
    text
    likesDisabled
    commentsDisabled
    sharingDisabled
    commentsUnviewedCount: commentsCount(viewedStatus: NOT_VIEWED)
    viewedStatus

    image {
      ...imageFragment
    }

    video {
      ...videoFragment
    }

    postedBy {
      ...postUserFragment
    }
  }
`
