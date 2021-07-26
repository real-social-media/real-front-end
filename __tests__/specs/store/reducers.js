import * as auth from 'store/ducks/auth/reducer'
import * as signup from 'store/ducks/signup/reducer'
import * as camera from 'store/ducks/camera/reducer'
import * as posts from 'store/ducks/posts/reducer'
import * as albums from 'store/ducks/albums/reducer'
import * as purchases from 'store/ducks/purchases/reducer'
import * as chat from 'store/ducks/chat/reducer'
import * as users from 'store/ducks/users/reducer'
import * as cache from 'store/ducks/cache/reducer'
import * as entities from 'store/ducks/entities/reducer'
import * as contacts from 'store/ducks/contacts/reducer'
import * as dating from 'store/ducks/dating/reducer'
import * as promocodes from 'store/ducks/promocodes/reducer'
import * as wallet from 'store/ducks/wallet/reducer'
import rootReducer from 'store/reducers'
import * as entitiesActions from 'store/ducks/entities/actions'
import * as authActions from 'store/ducks/auth/actions'
import { applyActions, mockDate } from 'tests/utils/helpers'
import Storage from 'services/Storage'

jest.spyOn(Storage, 'clearAll')

const initialState = {
  network: { isConnected: true, actionQueue: [], isQueuePaused: false },
  auth: auth.initialState,
  signup: signup.initialState,
  camera: camera.initialState,
  albums: albums.initialState,
  purchases: purchases.initialState,
  chat: chat.initialState,
  posts: posts.initialState,
  users: users.initialState,
  contacts: contacts.initialState,
  dating: dating.initialState,
  cache: cache.initialState,
  entities: entities.initialState,
  promocodes: promocodes.initialState,
  wallet: wallet.initialState,
}

const data = { 1: { id: 1 }, 2: { id: 2 } }
const entitiesMergeActions = [
  entitiesActions.entitiesAlbumsMerge({ data }),
  entitiesActions.entitiesPostsMerge({ data }),
  entitiesActions.entitiesCommentsMerge({ data }),
  entitiesActions.entitiesUsersMerge({ data }),
  entitiesActions.entitiesChatsMerge({ data }),
  entitiesActions.entitiesMessagesMerge({ data }),
]

describe('rootReducer', () => {
  let dateMock

  beforeAll(() => {
    dateMock = mockDate('2020-02-14')
  })

  afterAll(() => {
    dateMock.mockFn.mockRestore()
  })

  afterEach(() => {
    Storage.clearAll.mockClear()
  })

  it('initial state', () => {
    expect(rootReducer(undefined, { type: 'MOCK_ACTION' })).toEqual(initialState)
  })

  it('applyActions', () => {
    const state = applyActions(entitiesMergeActions, rootReducer)
    const updatedAt = 1581638400000

    expect(state.entities).toEqual({
      albums: { ...data, updatedAt },
      posts: { ...data, updatedAt },
      comments: { ...data, updatedAt },
      users: { ...data, updatedAt },
      chats: { ...data, updatedAt },
      messages: { ...data, updatedAt },
    })
  })

  it('reset state on signout', () => {
    const state = applyActions([...entitiesMergeActions, authActions.authSignoutSuccess()], rootReducer)

    expect(state.entities).toEqual(initialState.entities)
    expect(state).toEqual(initialState)
    expect(Storage.clearAll).toHaveBeenCalled()
  })
})
