import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as postsActions from 'store/ducks/posts/actions'
import SearchFeedContext from 'components/Search/Context'

const PostsFiltersService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { scrollToTop } = useContext(SearchFeedContext)
  const postsGetTrendingPosts = useSelector(postsSelector.postsGetTrendingPostsSelector)
  const initialValues = postsGetTrendingPosts.filters

  const handleClose = () => navigation.popToTop()

  const handleFilterChange = async (filters) => {
    await scrollToTop()

    dispatch(postsActions.postsGetTrendingPostsChangeFilters(filters))
    dispatch(postsActions.postsGetTrendingPostsRequest())
  }

  return children({
    initialValues,
    handleClose,
    handleFilterChange,
  })
}

export default PostsFiltersService
