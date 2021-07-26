import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/entities/constants'

export const entitiesAlbumsMerge = createAction(constants.ENTITIES_ALBUMS_MERGE)
export const entitiesPostsMerge = createAction(constants.ENTITIES_POSTS_MERGE)
export const entitiesCommentsMerge = createAction(constants.ENTITIES_COMMENTS_MERGE)
export const entitiesUsersMerge = createAction(constants.ENTITIES_USERS_MERGE)
export const entitiesChatsMerge = createAction(constants.ENTITIES_CHATS_MERGE)
export const entitiesMessagesMerge = createAction(constants.ENTITIES_MESSAGES_MERGE)
