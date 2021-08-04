import { combineReducers } from 'redux'
import { testReducer, mockDate } from 'tests/utils/helpers'
import { entitiesSelector } from 'store/ducks/entities/selectors'
import entities, { initialState } from 'store/ducks/entities/reducer'
import * as entitiesActions from 'store/ducks/entities/actions'

const reducer = combineReducers({ entities })

describe('Entities reducer', () => {
  let dateMock

  it('initialState', () => {
    dateMock = mockDate('2020-02-14')
    testReducer(reducer).expect(entitiesSelector, initialState)
    dateMock.mockFn.mockRestore()
  })

  it('set updatedAt on action', () => {
    dateMock.mockFn.mockRestore()
    dateMock = mockDate('2020-03-14')

    const data = { 1: { id: 1 }, 2: { id: 2 } }
    const updatedAt = dateMock.value

    testReducer(reducer)
      .put(entitiesActions.entitiesAlbumsMerge({ data }))
      .put(entitiesActions.entitiesPostsMerge({ data }))
      .put(entitiesActions.entitiesCommentsMerge({ data }))
      .put(entitiesActions.entitiesUsersMerge({ data }))
      .put(entitiesActions.entitiesChatsMerge({ data }))
      .put(entitiesActions.entitiesMessagesMerge({ data }))
      .expect(entitiesSelector, {
        albums: { ...data, updatedAt },
        chats: { ...data, updatedAt },
        comments: { ...data, updatedAt },
        messages: { ...data, updatedAt },
        posts: { ...data, updatedAt },
        users: { ...data, updatedAt },
      })

    dateMock.mockFn.mockRestore()
  })
})
