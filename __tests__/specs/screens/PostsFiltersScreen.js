/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testFilter"] }] */
import React from 'react'
import { useDispatch } from 'react-redux'
import { renderWithProviders, fireEvent } from 'tests/utils'
import { useNavigation } from '@react-navigation/native'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as postsActions from 'store/ducks/posts/actions'
import PostsFiltersScreen from 'screens/PostsFiltersScreen'
import { SearchFeedProvider } from 'components/Search/Context'

jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (i) => i() }))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useScrollToTop: jest.fn() }))
jest.mock('store/ducks/posts/selectors', () => ({ postsGetTrendingPostsSelector: jest.fn() }))

postsSelector.postsGetTrendingPostsSelector.mockReturnValue({ filters: {} })

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const navigation = { popToTop: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = (props) =>
  renderWithProviders(
    <SearchFeedProvider>
      <PostsFiltersScreen {...props} />
    </SearchFeedProvider>,
  )

jest.useFakeTimers()

describe('PostsFiltersScreen', () => {
  afterEach(() => {
    dispatch.mockClear()
    navigation.popToTop.mockClear()
  })

  const testFilter = ({ name, filters }) => {
    const { getByText } = setup()

    fireEvent.press(getByText(name))
    fireEvent.press(getByText('Apply Filters'))

    jest.runAllTimers()

    expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetTrendingPostsChangeFilters(filters))

    dispatch.mockClear()
  }

  it('toggle Verified/Unverified', () => {
    testFilter({ name: 'Authenticated', filters: { isVerified: true, viewedStatus: undefined } })
    testFilter({ name: 'Unauthenticated', filters: { isVerified: false, viewedStatus: undefined } })
  })

  it('toggle Viewed/Unviewed', () => {
    testFilter({ name: 'Viewed', filters: { isVerified: undefined, viewedStatus: 'VIEWED' } })
    testFilter({ name: 'Unviewed', filters: { isVerified: undefined, viewedStatus: 'NOT_VIEWED' } })
  })

  it('clear all', () => {
    const { getByText } = setup()

    fireEvent.press(getByText('Authenticated'))
    fireEvent.press(getByText('Viewed'))
    fireEvent.press(getByText('Clear All'))
    expect(navigation.popToTop).not.toHaveBeenCalled()

    fireEvent.press(getByText('Apply Filters'))
    jest.runAllTimers()

    expect(dispatch).toHaveBeenCalledWith(
      postsActions.postsGetTrendingPostsChangeFilters({ isVerified: undefined, viewedStatus: undefined }),
    )
  })

  it('close modal on submit', () => {
    const { getByText } = setup()

    expect(navigation.popToTop).not.toHaveBeenCalled()

    fireEvent.press(getByText('Apply Filters'))
    jest.runAllTimers()

    expect(navigation.popToTop).toHaveBeenCalled()
  })

  it('initial values', () => {
    const filters = { isVerified: true, viewedStatus: 'VIEWED' }
    postsSelector.postsGetTrendingPostsSelector.mockReturnValueOnce({ filters })

    const { getByText } = setup()
    fireEvent.press(getByText('Apply Filters'))
    jest.runAllTimers()

    expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetTrendingPostsChangeFilters(filters))
  })
})
