import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import * as normalizer from 'normalizer/schemas'
import posts from 'store/ducks/posts/saga'
import * as queries from 'store/ducks/posts/queries'
import * as postsActions from 'store/ducks/posts/actions'
import * as queryService from 'services/Query'
import { entitiesMerge } from 'store/ducks/entities/saga'

jest.mock('store/ducks/users/saga/usersCheckPermissions', () => jest.fn())
jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const payload = { postId: 'id123', lifetime: null }
const response = { data: { editPost: { postId: 1 } } }

describe('postsEditRequest', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    queryService.apiRequest.mockResolvedValue(response)

    await expectSaga(testAsRootSaga(posts))
      .call(entitiesMerge, normalizer.normalizePostGet(response.data.editPost))
      .put(postsActions.postsEditSuccess({ data: 1, payload, meta: {} }))

      .dispatch(postsActions.postsEditRequest(payload))
      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.editPostExpiresAt, {
      postId: 'id123',
      expiresAt: null,
    })
    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.editPostAlbum, payload)
    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.editPost, payload)
  })

  it('failure', async () => {
    const error = new Error('Error')
    queryService.apiRequest.mockRejectedValueOnce(error)

    await expectSaga(testAsRootSaga(posts))
      .put(postsActions.postsEditFailure(error, payload))

      .dispatch(postsActions.postsEditRequest(payload))
      .silentRun()
  })
})
