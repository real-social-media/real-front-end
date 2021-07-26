import * as AwsAPI from '@aws-amplify/api'
import * as keywordsAPI from 'store/ducks/keywords/api'
import * as keywordsQueries from 'store/ducks/keywords/queries'

/**
 * Mock Data
 */
const keyword = 'keyword'

jest.mock('@aws-amplify/api', () => ({
  graphqlOperation: jest.fn(),
  graphql: jest.fn(),
}))

describe('keywords API', () => {
  describe('searchKeywords', () => {
    it('use correct query', async () => {
      await keywordsAPI.searchKeywords(keyword)

      expect(AwsAPI.graphql).toHaveBeenCalled()
      expect(AwsAPI.graphqlOperation).toHaveBeenCalledWith(keywordsQueries.searchKeywords, { keyword })
    })

    it('return keywords', async () => {
      const response = { data: { searchKeywords: ['a', 'b'] } }
      AwsAPI.graphql.mockResolvedValueOnce(response)

      const result = await keywordsAPI.searchKeywords(keyword)

      expect(result).toEqual(response.data.searchKeywords)
    })

    it('empty response', async () => {
      const response = {}
      AwsAPI.graphql.mockResolvedValueOnce(response)

      const result = await keywordsAPI.searchKeywords(keyword)

      expect(result).toEqual([])
    })
  })
})
