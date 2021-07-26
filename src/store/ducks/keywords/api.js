import AwsAPI, { graphqlOperation } from '@aws-amplify/api'
import * as keywordsQueries from 'store/ducks/keywords/queries'

export async function searchKeywords(keyword) {
  const response = await AwsAPI.graphql(graphqlOperation(keywordsQueries.searchKeywords, { keyword }))
  const data = response?.data?.searchKeywords || []

  return data
}
