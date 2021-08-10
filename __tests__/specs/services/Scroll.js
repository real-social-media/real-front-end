import ScrollService from 'services/Scroll'

const resource = {}
const loadInit = jest.fn()
const loadMore = jest.fn()
const extra = { a: 1, b: 2 }
const requiredProps = { resource, loadInit, loadMore }

const setup = (props) => ScrollService(props)

describe('ScrollService', () => {
  afterEach(() => {
    loadInit.mockClear()
    loadMore.mockClear()
  })

  it('handleLoadMore', () => {
    const nextToken = 'nextToken'
    const resource = {
      status: 'success',
      data: [1, 2],
      meta: { nextToken },
      payload: { nextToken: 'anotherOneToken' },
    }

    const scroll = setup({ ...requiredProps, resource })

    expect(loadMore).not.toHaveBeenCalled()

    scroll.handleLoadMore()
    expect(loadMore).toHaveBeenCalledWith({ nextToken })
  })

  it('handleRefresh', () => {
    const scroll = setup(requiredProps)

    expect(loadInit).not.toHaveBeenCalled()

    scroll.handleRefresh()
    expect(loadInit).toHaveBeenCalledWith({})
  })

  it('handleRefresh with extra params', () => {
    const scroll = setup({ ...requiredProps, extra })

    expect(loadInit).not.toHaveBeenCalled()

    scroll.handleRefresh()
    expect(loadInit).toHaveBeenCalledWith(extra)
  })

  it('refreshing', () => {
    const resource = { status: 'loading', payload: {} }
    const scroll = setup({ ...requiredProps, resource })

    expect(scroll.refreshing).toBeTruthy()
    expect(scroll.loadingmore).toBeFalsy()
  })

  it('loadingmore', () => {
    const resource = { status: 'loading', payload: { nextToken: 'nextToken' } }
    const scroll = setup({ ...requiredProps, resource })

    expect(scroll.refreshing).toBeFalsy()
    expect(scroll.loadingmore).toBeTruthy()
  })
})
