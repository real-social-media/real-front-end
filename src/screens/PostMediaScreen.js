import React from 'react'
import PostMediaComponent from 'components/PostMedia'
import PostMediaServiceComponent from 'components/PostMedia/index.service'

class PostMediaScreen extends React.Component {
  render() {
    return (
      <PostMediaServiceComponent>
        {(postMediaProps) => (
          <PostMediaComponent
            {...postMediaProps}
          />
        )}
      </PostMediaServiceComponent>
    )
  }
}

export default PostMediaScreen
