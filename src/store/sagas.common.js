import appState from 'store/ducks/appState/saga'
import albums from 'store/ducks/albums/saga'
import chat from 'store/ducks/chat/saga'
import subscriptions from 'store/ducks/subscriptions/saga'
import promocodes from 'store/ducks/promocodes/saga'
import contactsGrantBonusRequest from 'store/ducks/contacts/saga/contactsGrantBonusRequest'
import themes from 'store/ducks/themes/saga'
import analytics from 'store/ducks/analytics/saga'
import users from 'store/ducks/users/saga'
import logger from 'store/ducks/logger/saga'
import wallet from 'store/ducks/wallet/saga'
import snackbars from 'store/ducks/snackbars/saga'

import auth from 'store/ducks/auth/saga'
import signup from 'store/ducks/signup/saga'

import datingMatchedUsers from 'store/ducks/dating/saga/datingMatchedUsers'
import datingConfirmedUsers from 'store/ducks/dating/saga/datingConfirmedUsers'
import datingMatchApprove from 'store/ducks/dating/saga/datingMatchApprove'
import datingMatchReject from 'store/ducks/dating/saga/datingMatchReject'

import posts from 'store/ducks/posts/saga'
import postsReportPostViews from 'store/ducks/posts/saga/postsReportPostViews'
import postsGetTrendingPosts from 'store/ducks/posts/saga/postsGetTrendingPosts'

export default () =>
  []
    .concat(snackbars())
    .concat(logger())
    .concat(analytics())
    .concat(albums())
    .concat(chat())
    .concat(themes())
    .concat(subscriptions())
    .concat(contactsGrantBonusRequest())
    .concat(wallet())

    .concat(users())
    .concat(promocodes())

    .concat(auth())
    .concat(signup())

    .concat(posts())
    .concat(postsReportPostViews())
    .concat(postsGetTrendingPosts())

    .concat(datingMatchedUsers())
    .concat(datingConfirmedUsers())
    .concat(datingMatchApprove())
    .concat(datingMatchReject())
    .concat(appState())
