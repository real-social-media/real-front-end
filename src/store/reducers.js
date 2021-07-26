import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import Storage, { STORAGE_PROVIDER, STORAGE_KEYS } from 'services/Storage'
import auth from 'store/ducks/auth/reducer'
import signup from 'store/ducks/signup/reducer'
import camera from 'store/ducks/camera/reducer'
import posts from 'store/ducks/posts/reducer'
import albums from 'store/ducks/albums/reducer'
import purchases from 'store/ducks/purchases/reducer'
import chat from 'store/ducks/chat/reducer'
import users from 'store/ducks/users/reducer'
import cache from 'store/ducks/cache/reducer'
import entities from 'store/ducks/entities/reducer'
import contacts from 'store/ducks/contacts/reducer'
import wallet from 'store/ducks/wallet/reducer'
import dating from 'store/ducks/dating/reducer'
import promocodes from 'store/ducks/promocodes/reducer'
import { reducer as network } from 'react-native-offline'
import * as authConstants from 'store/ducks/auth/constants'

import 'store/ducks/posts/updates'
import 'store/ducks/users/updates'
import 'store/ducks/chat/updates'

const postsPersistConfig = {
  key: STORAGE_KEYS.POSTS_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
  whitelist: [
    // 'postsFeedGet',
    // 'postsGet',
    // 'postsGetCache',
    // 'postsGetTrendingPosts',
    // 'postsPool',
    // 'postsCreateQueue',
  ],
}

const usersPersistConfig = {
  key: STORAGE_KEYS.USERS_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
  whitelist: [
    // 'usersPool',
  ],
}

const authPersistConfig = {
  key: STORAGE_KEYS.AUTH_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
  whitelist: [
    // 'user',
  ],
}

const signupPersistConfig = {
  key: STORAGE_KEYS.SIGNUP_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
  whitelist: [
  ],
}

const chatPersistConfig = {
  key: STORAGE_KEYS.CHAT_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
  whitelist: [
    // 'chatGetChats',
  ],
}

const purchasesPersistConfig = {
  key: STORAGE_KEYS.PURCHASES_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
}

const contactsPersistConfig = {
  key: STORAGE_KEYS.CONTACTS_REDUCER,
  version: 3,
  storage: STORAGE_PROVIDER,
}

const appReducer = combineReducers({
  network,
  auth: persistReducer(authPersistConfig, auth),
  signup: persistReducer(signupPersistConfig, signup),
  camera,
  albums,
  purchases: persistReducer(purchasesPersistConfig, purchases),
  chat: persistReducer(chatPersistConfig, chat),
  posts: persistReducer(postsPersistConfig, posts),
  users: persistReducer(usersPersistConfig, users),
  contacts: persistReducer(contactsPersistConfig, contacts),
  dating,
  promocodes,
  cache,
  wallet,
  entities,
})

const rootReducer = (state, action) => {
  if (action.type === authConstants.AUTH_SIGNOUT_SUCCESS) {
    Storage.clearAll()
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

export default rootReducer
