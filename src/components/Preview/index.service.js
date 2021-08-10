import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as postsActions from 'store/ducks/posts/actions'
import path from 'ramda/src/path'
import dayjs from 'dayjs'

export const PostPreviewService = ({ children }) => {
  const dispatch = useDispatch()
  const route = useRoute()

  const postId = path(['params', 'postId'])(route)
  const renderUri = path(['params', 'renderUri'])(route)

  const postsSingleGet = useSelector(postsSelector.postsSingleGetSelector)

  /**
   * Load post data only if not loaded previously
   */
  useEffect(() => {
    if (postsSingleGet.data.postId === postId || postsSingleGet.status === 'loading') {
      return
    }
    dispatch(postsActions.postsSingleGetRequest({ postId }))
  }, [postId])

  /**
   * Props required for post image preview component
   */
  const postPreviewProps = useMemo(() => ({
    image: {
      thumbnailSource: { uri: path(['data', 'image', 'url64p'])(postsSingleGet) },
      imageSource: { uri: path(['data', 'image', 'url1080p'])(postsSingleGet) },
    },
    text: {
      text: path(['data', 'postType'])(postsSingleGet) === 'TEXT_ONLY' ? postsSingleGet.data.text : null,
    },
    renderUri,
  }), [postsSingleGet])

  /**
   * Props required for post author preview component
   */
  const postUserProps = useMemo(() => ({
    image: {
      thumbnailSource: { uri: path(['data', 'postedBy', 'photo', 'url480p'])(postsSingleGet) },
      imageSource: { uri: path(['data', 'postedBy', 'photo', 'url480p'])(postsSingleGet) },
    },
    user: path(['data', 'postedBy'])(postsSingleGet),
    subtitle: `Posted ${dayjs(path(['data', 'postedAt'])(postsSingleGet)).from(dayjs())}`,
  }), [postsSingleGet])

  return children({
    postsSingleGet,
    postPreviewProps,
    postUserProps,
  })
}

export default PostPreviewService
