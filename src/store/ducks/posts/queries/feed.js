export const feedPostFragment = `
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

  fragment originalPostUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
  }

  fragment commentUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
  }

  fragment taggedUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
  }

  fragment albumUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
  }

  fragment likedUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel

    photo {
      ...imageFragment
    }
  }

  fragment originalPostFragment on Post {
    postId
    isVerified
    adStatus
    likesDisabled
    commentsDisabled
    sharingDisabled
    postedBy {
      ...originalPostUserFragment
    }
  }

  fragment postAlbumFragment on Post {
    postId
    isVerified
    adStatus
    image {
      ...imageFragment
    }
    postedBy {
      ...originalPostUserFragment
    }
  }

  fragment commentFragment on Comment {
    commentId
    commentedAt
    commentedBy {
      ...commentUserFragment
    }
    text
    textTaggedUsers {
      tag
      user {
        ...taggedUserFragment
      }
    }
  }

  fragment albumFragment on Album {
    albumId
    createdAt
    name
    description
    postCount
    postsLastUpdatedAt
    art {
      ...imageFragment
    }
    ownedBy {
      ...albumUserFragment
    }
    posts(limit: 10) {
      items {
        ...postAlbumFragment
      }
      nextToken
    }
  }

  fragment feedPostFragment on Post {
    postId
    postStatus
    postType
    postedAt
    expiresAt
    payment
    keywords
    text
    imageUploadUrl
    isVerified
    adStatus
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

    textTaggedUsers {
      tag
      user {
        ...taggedUserFragment
      }
    }

    image {
      ...imageFragment
    }

    postedBy {
      ...postUserFragment
    }

    originalPost {
      ...originalPostFragment
    }

    onymouslyLikedBy (limit: 1) {
      items {
        ...likedUserFragment
      }
      nextToken
    }

    comments (limit: 3) {
      items {
        ...commentFragment
      }
      nextToken
    }

    album {
      ...albumFragment
    }
  }
`
