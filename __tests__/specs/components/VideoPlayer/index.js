import React from 'react'
import Video from 'react-native-video'
import { renderWithStore, act, fireEvent } from 'tests/utils'
import VideoPlayer from 'components/VideoPlayer'
import testIDs from 'components/VideoPlayer/test-ids'

jest.mock('react-native-video', () => jest.fn().mockImplementation(() => null))

const defaultResolution = {
  width: 3840,
  height: 2160,
}

const setup = (props) => renderWithStore(
  <VideoPlayer
    resolution={defaultResolution}
    {...props}
  />,
)

describe('VideoPlayer component', () => {
  beforeEach(() => {
    Video.mockClear()
  })

  it('should render Video', () => {
    setup()

    expect(Video).toHaveBeenCalled()
  })

  it('should render Video paused by default', () => {
    setup()

    const [[video]] = Video.mock.calls

    expect(video.paused).toBeTruthy()
  })

  it('should render Video repeat true by default', () => {
    setup()

    const [[video]] = Video.mock.calls

    expect(video.repeat).toBeTruthy()
  })

  it('should show the sound control after toggling the sound', async () => {
    const { queryByTestId } = setup()

    await act(async () => {
      fireEvent.press(queryByTestId(testIDs.root))
    })

    expect(queryByTestId(testIDs.sound)).toBeTruthy()
  })

  it('should hide sound control after 3s delay', async () => {
    jest.useFakeTimers()

    const { queryByTestId } = setup()

    await act(async () => {
      fireEvent.press(queryByTestId(testIDs.root))
    })

    jest.runOnlyPendingTimers()
    expect(queryByTestId(testIDs.sound)).toBeNull()
  })

  it('should render progress when playing', () => {
    const { queryByTestId } = setup({
      playing: true,
    })

    expect(queryByTestId(testIDs.progress)).toBeTruthy()
  })

  it('should not render progress when paused', () => {
    const { queryByTestId } = setup()

    expect(queryByTestId('progress')).toBeNull()
  })
})
