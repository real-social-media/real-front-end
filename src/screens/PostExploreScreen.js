import React from 'react'
import PostExploreComponent from 'components/PostExplore'
import PostExploreServiceComponent from 'components/PostExplore/index.service'

class PostExploreScreen extends React.Component {
  render() {
    return (
      <PostExploreServiceComponent>
        {(postMediaProps) => (
          <PostExploreComponent
            {...postMediaProps}
          />
        )}
      </PostExploreServiceComponent>
    )
  }
}

export default PostExploreScreen
