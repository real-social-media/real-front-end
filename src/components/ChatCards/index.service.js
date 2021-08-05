import { useSelector } from 'react-redux'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as navigationActions from 'navigation/actions'
import { useNavigation } from '@react-navigation/native'

const ChatCardsService = ({ children }) => {
  const navigation = useNavigation()
  const postsGetUnreadComments = useSelector(postsSelector.postsGetUnreadCommentsSelector)

  const handleCardPress = ({ post }) =>
    navigationActions.navigateComments(navigation, { post })()

  return children({
    postsGetUnreadComments,
    handleCardPress,
  })
}

export default ChatCardsService
