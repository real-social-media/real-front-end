import { put } from 'redux-saga/effects'
import * as entitiesActions from 'store/ducks/entities/actions'

export function* entitiesMerge({ entities }) {
  if (entities.albums) {
    yield put(entitiesActions.entitiesAlbumsMerge({ data: entities.albums }))
  }

  if (entities.posts) {
    yield put(entitiesActions.entitiesPostsMerge({ data: entities.posts }))
  }

  if (entities.users) {
    yield put(entitiesActions.entitiesUsersMerge({ data: entities.users }))
  }

  if (entities.comments) {
    yield put(entitiesActions.entitiesCommentsMerge({ data: entities.comments }))
  }

  if (entities.messages) {
    yield put(entitiesActions.entitiesMessagesMerge({ data: entities.messages }))
  }

  if (entities.chats) {
    yield put(entitiesActions.entitiesChatsMerge({ data: entities.chats }))
  }
}
