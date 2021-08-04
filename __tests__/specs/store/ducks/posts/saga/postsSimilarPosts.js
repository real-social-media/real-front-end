import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import * as actions from 'store/ducks/posts/actions'
import { entitiesMerge } from 'store/ducks/entities/saga'
import * as queries from 'store/ducks/posts/queries'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import postsSimilarPosts from 'store/ducks/posts/saga/postsSimilarPosts'

/**
 * Mock Data
 */
const payload = { postId: '1' }

/**
 * Mock Functions
 */
jest.mock('services/Query', () => ({ apiRequest: jest.fn() }))

describe('postsSimilarPosts', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const items = [{ postId: '1' }, { postId: '2' }]
    const response = { data: { similarPosts: { items, nextToken: 'nextToken' } } }
    queryService.apiRequest.mockResolvedValueOnce(response)

    await expectSaga(testAsRootSaga(postsSimilarPosts))
      .call([queryService, 'apiRequest'], queries.similarPosts, payload)
      .put(actions.postsSimilarSuccess({ data: ['1', '2'], meta: { nextToken: 'nextToken' } }))
      .call(entitiesMerge, normalizer.normalizePostsGet(response.data.similarPosts.items))

      .dispatch(actions.postsSimilarRequest(payload))
      .silentRun()
  })

  it('failure', async () => {
    const error = new Error('Error')
    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(postsSimilarPosts))
      .put(actions.postsSimilarFailure(error))

      .dispatch(actions.postsSimilarRequest(payload))
      .silentRun()
  })
})
