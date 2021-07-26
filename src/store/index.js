import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { createNetworkMiddleware } from 'react-native-offline'
import createSagaMiddleware from 'redux-saga'
import rootReducer from 'store/reducers'
import rootSaga from 'store/sagas'
import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api'
import { Credentials } from '@aws-amplify/core'
import * as Logger from 'services/Logger'
import { STORAGE_PROVIDER } from 'services/Storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import 'store/updates'

const initializeStore = ({ navigationRef }) => {
  const persistConfig = {
    key: '/v2/root',
    storage: STORAGE_PROVIDER,
    whitelist: ['theme', 'translation'],
    stateReconciler: autoMergeLevel2,
  }

  const networkMiddleware = createNetworkMiddleware({
    queueReleaseThrottle: 200,
  })

  /**
   * Dangeourusly get Amplify Credentials storage, it syncs InMemoryStorage + AsyncStorage
   * which is the reason of grabbing same instance although we could also generate it using
   * (new StorageHelper()).getStorage() which will break credentials token sync.
   */
  const AwsCache = Auth._storage

  const sagaMiddleware = createSagaMiddleware({
    context: {
      ReactNavigationRef: navigationRef,
      AwsCache,
      AwsAuth: Auth,
      AwsAPI: API,
      AwsCredentials: Credentials,
    },
    onError: Logger.captureException,
  })

  const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25,
    actionsBlacklist: [
      'persist/REHYDRATE',

      'POSTS_CREATE_PROGRESS',

      'CACHE_FETCH_REQUEST',
      'CACHE_FETCH_SUCCESS',
      'CACHE_FETCH_PROGRESS',

      'ENTITIES_ALBUMS_MERGE',
      'ENTITIES_POSTS_MERGE',
      'ENTITIES_COMMENTS_MERGE',
      'ENTITIES_USERS_MERGE',
      'ENTITIES_CHATS_MERGE',
      'ENTITIES_MESSAGES_MERGE',

      'USERS_REPORT_SCREEN_VIEWS_REQUEST',
      'POSTS_REPORT_POST_VIEWS_REQUEST',
    ],
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const middlewares = applyMiddleware(networkMiddleware, sagaMiddleware)
  const store = createStore(persistedReducer, composeEnhancers(middlewares))
  const persistor = persistStore(store)

  sagaMiddleware.run(rootSaga, persistor)

  return { store, persistor }
}

export default initializeStore
