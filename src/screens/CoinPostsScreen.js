import React from 'react'
import CoinPostsComponent from 'components/CoinPosts'
import CoinPostsServiceComponent from 'components/CoinPosts/index.service'

class CoinPostsScreen extends React.Component {
  render() {
    return (
      <CoinPostsServiceComponent>
        {(props) => (
          <CoinPostsComponent
            {...props}
          />
        )}
      </CoinPostsServiceComponent>
    )
  }
}

export default CoinPostsScreen
