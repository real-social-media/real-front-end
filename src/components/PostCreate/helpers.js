export const uniqueTags = (tags) => [...new Set(tags)]
export const joinTags = (...collections) => uniqueTags(collections.reduce((acc, item) => acc.concat(item), []))
export const removeHashtag = (str) => str.replace('#', '')
export const replaceAll = (search, replacement, str = '') =>
  str
    .split(' ')
    .map((item) => (item === search ? replacement : item))
    .join(' ')
export const searchTags = (str = '') => uniqueTags(str.match(/[#]+[A-Za-z0-9-_]+/g)).map(removeHashtag)
