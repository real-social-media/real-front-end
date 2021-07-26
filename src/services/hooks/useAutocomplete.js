import { useState, useEffect, useReducer, useCallback } from 'react'
import useDebouncedValue from 'services/hooks/useDebouncedValue'

const initialState = {
  status: 'idle',
  data: [],
}

const idle = () => ({ type: 'IDLE' })
const request = () => ({ type: 'REQUEST' })
const success = (payload) => ({ type: 'SUCCESS', payload })
const failure = () => ({ type: 'FAILURE' })

function reducer(state, action) {
  switch (action.type) {
    case 'IDLE':
      return initialState
    case 'REQUEST':
      return { ...state, status: 'loading', data: [] }
    case 'SUCCESS':
      return { ...state, status: 'success', data: action.payload }
    case 'FAILURE':
      return { ...state, status: 'failure' }
    default:
      throw new Error('Unsupported type')
  }
}

function useAutocomplete(api) {
  const [search, handleSearch] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const query = useDebouncedValue(search, 300)
  const clear = useCallback(() => handleSearch(''), [dispatch])

  useEffect(() => {
    async function autocomplete() {
      try {
        dispatch(request())

        const response = await api(query)
        dispatch(success(response))
      } catch (error) {
        dispatch(failure(error))
      }
    }

    if (query) {
      autocomplete()
    } else if (['success', 'failure'].includes(state.status)) {
      dispatch(idle())
    }
  }, [query])

  return { search, handleSearch, state, clear }
}

export default useAutocomplete
