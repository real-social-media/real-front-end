import { renderHook, act } from '@testing-library/react-hooks'
import useAutocomplete from 'services/hooks/useAutocomplete'

/**
 * Mock Data
 */
const data = ['a', 'b', 'c']

/**
 * Mock Functions
 */
jest.useFakeTimers()
const fakeAPI = jest.fn().mockResolvedValue(data)

const setup = () => renderHook(() => useAutocomplete(fakeAPI))

describe('useAutocomplete hook', () => {
  it('idle', () => {
    const { result } = setup()

    expect(result.current.state).toEqual({ status: 'idle', data: [] })
  })

  it('loading', async () => {
    const { result, waitForNextUpdate } = setup()

    act(() => result.current.handleSearch('query'))
    act(() => jest.runAllTimers())

    expect(result.current.state).toEqual({ status: 'loading', data: [] })

    await waitForNextUpdate()
  })

  it('success', async () => {
    const { result, waitForNextUpdate } = setup()

    act(() => result.current.handleSearch('query'))
    act(() => jest.runAllTimers())
    await waitForNextUpdate()

    expect(result.current.state).toEqual({ status: 'success', data })
  })

  it('failure', async () => {
    const error = new Error('Error')
    fakeAPI.mockRejectedValueOnce(error)
    const { result, waitForNextUpdate } = setup()

    act(() => result.current.handleSearch('query'))
    act(() => jest.runAllTimers())
    await waitForNextUpdate()

    expect(result.current.state).toEqual({ status: 'failure', data: [] })
  })

  it('clear state when search empty', async () => {
    const { result, waitForNextUpdate } = setup()

    act(() => result.current.handleSearch('query'))
    act(() => jest.runAllTimers())
    await waitForNextUpdate()

    expect(result.current.state).toEqual({ status: 'success', data })

    act(() => result.current.handleSearch(''))
    act(() => jest.runAllTimers())

    expect(result.current.state).toEqual({ status: 'idle', data: [] })
  })

  it('clear state callback', async () => {
    const { result, waitForNextUpdate } = setup()

    act(() => result.current.handleSearch('query'))
    act(() => jest.runAllTimers())
    await waitForNextUpdate()

    expect(result.current.state).toEqual({ status: 'success', data })

    act(() => result.current.clear())
    act(() => jest.runAllTimers())

    expect(result.current.state).toEqual({ status: 'idle', data: [] })
  })
})
