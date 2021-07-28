import reducer from 'store/ducks/player/reducer'
import * as actions from 'store/ducks/player/actions'

const initialState = {
  muted: true,
}

describe('Player reducer', () => {
  it('should return initial state', () => {
    const state = reducer(undefined, {})
    expect(state).toEqual(initialState)
  })

  it('should toggle sound', () => {
    const state = reducer(undefined, actions.toggleSound())
    expect(state).toEqual({
      muted: false,
    })

    const toggleAgain = reducer(state, actions.toggleSound())
    expect(toggleAgain).toEqual({
      muted: true,
    })
  })
})
