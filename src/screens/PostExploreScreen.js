import React from 'react'
import PostExploreComponent from 'components/PostExplore'
import PostExploreServiceComponent from 'components/PostExplore/index.service'
import PostServiceComponent from 'components/Post/index.service'

class PostExploreScreen extends React.Component {
  render() {
    return (
      <PostServiceComponent>
        {(postProps) => (
          <PostExploreServiceComponent>
            {(postMediaProps) => (
              <PostExploreComponent
                {...postMediaProps}
                {...postProps}
              />
            )}
          </PostExploreServiceComponent>
        )}
      </PostServiceComponent>
    )
  }
}

export default PostExploreScreen
