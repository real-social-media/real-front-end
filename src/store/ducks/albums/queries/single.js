export const singleAlbumFragment = `
  fragment albumImageFragment on Image {
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

  fragment albumUserFragment on User {
    userId
    username
    fullName
    displayName
    themeCode
    subscriptionLevel
  }

  fragment singleAlbumFragment on Album {
    albumId
    createdAt
    name
    description
    postCount
    postsLastUpdatedAt
    ownedBy {
      ...albumUserFragment
    }
    art {
      ...albumImageFragment
    }
  }
`


export const singleAlbumPostFragment = `
  fragment postImageFragment on Image {
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
  }

  fragment singleAlbumPostFragment on Post {
    postId
    postStatus
    postType
    postedAt
    expiresAt
    text
    likesDisabled
    commentsDisabled
    sharingDisabled
    image {
      ...postImageFragment
    }

    postedBy {
      ...postUserFragment
    }
  }
`
