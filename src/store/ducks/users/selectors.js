import path from 'ramda/src/path'
import assocPath from 'ramda/src/assocPath'
import * as normalizer from 'normalizer/schemas'
import { initialState } from 'store/ducks/users/reducer'
import { entitiesSelector } from 'store/ducks/entities/selectors'
import { createDeepEqualSelector } from 'store/helpers'

/**
 *
 */
export const usersGetProfile = path(['users', 'usersGetProfile'])

export const usersGetProfileSelector = (userId) => createDeepEqualSelector(
  [usersGetProfile, entitiesSelector],
  (usersGetProfile, entities) => {
    const user = userId || path(['data'])(usersGetProfile)
    const denormalized = normalizer.denormalizeUserGet(user, entities)
    return assocPath(['data'], denormalized)(usersGetProfile)
  },
)

/**
 *
 */
const usersGetFollowedUsersCacheUser = (userId) => path(['users', 'usersGetFollowedUsersCache', userId])

export const usersGetFollowedUsersSelector = (userId) => createDeepEqualSelector(
  [usersGetFollowedUsersCacheUser(userId), entitiesSelector],
  (usersGetFollowedUsersCacheUser, entities) => {
    const users = path(['data'])(usersGetFollowedUsersCacheUser) ? usersGetFollowedUsersCacheUser : initialState.usersGetFollowedUsers
    const denormalized = normalizer.denormalizeUsersGet(users.data, entities)
    return assocPath(['data'], denormalized)(users)
  },
)

/**
 *
 */
const usersGetFollowerUsersCacheUser = (userId) => path(['users', 'usersGetFollowerUsersCache', userId])

export const usersGetFollowerUsersSelector = (userId) => createDeepEqualSelector(
  [usersGetFollowerUsersCacheUser(userId), entitiesSelector],
  (usersGetFollowerUsersCacheUser, entities) => {
    const users = path(['data'])(usersGetFollowerUsersCacheUser) ? usersGetFollowerUsersCacheUser : initialState.usersGetFollowerUsers
    const denormalized = normalizer.denormalizeUsersGet(users.data, entities)
    return assocPath(['data'], denormalized)(users)
  },
)

/**
 *
 */
const usersGetTrendingUsers = () => path(['users', 'usersGetTrendingUsers'])

export const usersGetTrendingUsersSelector = createDeepEqualSelector(
  [usersGetTrendingUsers(), entitiesSelector],
  (usersGetTrendingUsers, entities) => {
    const denormalized = normalizer.denormalizeUsersGet(usersGetTrendingUsers.data, entities)
    return assocPath(['data'], denormalized)(usersGetTrendingUsers)
  },
)

/**
 *
 */
export const usersSearch = () => path(['users', 'usersSearch'])

export const usersSearchSelector = createDeepEqualSelector(
  [usersSearch(), entitiesSelector],
  (usersSearch, entities) => {
    const denormalized = normalizer.denormalizeUsersGet(usersSearch.data, entities)
    return assocPath(['data'], denormalized)(usersSearch)
  },
)

/**
 *
 */
const usersGetFollowedUsersWithStories = () => path(['users', 'usersGetFollowedUsersWithStories'])

export const usersGetFollowedUsersWithStoriesSelector = createDeepEqualSelector(
  [usersGetFollowedUsersWithStories(), entitiesSelector],
  (usersGetFollowedUsersWithStories, entities) => {
    const denormalized = normalizer.denormalizeUsersGet(usersGetFollowedUsersWithStories.data, entities)
    return assocPath(['data'], denormalized)(usersGetFollowedUsersWithStories)
  },
)

/**
 *
 */
const usersGetPendingFollowers = () => path(['users', 'usersGetPendingFollowers'])

export const usersGetPendingFollowersSelector = createDeepEqualSelector(
  [usersGetPendingFollowers(), entitiesSelector],
  (usersGetPendingFollowers, entities) => {
    const denormalized = normalizer.denormalizeUsersGet(usersGetPendingFollowers.data, entities)
    return assocPath(['data'], denormalized)(usersGetPendingFollowers)
  },
)

const usersImagePostsGet = () => path(['users', 'usersImagePostsGet'])

export const usersImagePostsGetSelector = createDeepEqualSelector(
  [usersImagePostsGet(), entitiesSelector],
  (usersImagePostsGet, entities) => {
    const denormalized = normalizer.denormalizePostsGet(usersImagePostsGet.data, entities)

    return assocPath(['data'], denormalized)(usersImagePostsGet)
  },
)

export const usersDeleteAvatar = path(['users', 'usersDeleteAvatar'])
export const usersChangeAvatar = path(['users', 'usersChangeAvatar'])
export const usersCreateAvatar = path(['users', 'usersCreateAvatar'])
export const usersSetUserDatingStatus = path(['users', 'usersSetUserDatingStatus'])
export const usersEditProfile = path(['users', 'usersEditProfile'])
export const usersAcceptFollowerUser = path(['users', 'usersAcceptFollowerUser'])
export const usersDeclineFollowerUser = path(['users', 'usersDeclineFollowerUser'])
export const usersUnfollow = path(['users', 'usersUnfollow'])
export const usersFollow = path(['users', 'usersFollow'])
