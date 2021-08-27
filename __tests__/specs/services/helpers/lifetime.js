import dayjs from 'dayjs'
import { options, getLabel, getValueByDate, getExpiredDate } from 'services/helpers/lifetime'

describe('lifetime helper', () => {
  it('options', () => {
    expect(options).toEqual([
      { label: 'Story', value: 'P1D' },
      { label: 'Week', value: 'P7D' },
      { label: 'Month', value: 'P1M' },
      { label: 'Year', value: 'P1Y' },
      { label: 'Forever', value: null },
    ])
  })

  it('getLabel', () => {
    expect(getLabel('P1D')).toBe('for a Day')
    expect(getLabel('P7D')).toBe('for a Week')
    expect(getLabel('P1M')).toBe('for a Month')
    expect(getLabel('P1Y')).toBe('for a Year')
    expect(getLabel(null)).toBe('Forever')
  })

  it('getValueByDate/getExpiredDate', () => {
    const s1m = (date) => dayjs(date).subtract(1, 'minute').toJSON()
    expect(getValueByDate(s1m(getExpiredDate('P1D')))).toBe('P1D')
    expect(getValueByDate(s1m(getExpiredDate('P7D')))).toBe('P7D')
    expect(getValueByDate(s1m(getExpiredDate('P1M')))).toBe('P1M')
    expect(getValueByDate(s1m(getExpiredDate('P1Y')))).toBe('P1Y')
    expect(getValueByDate(getExpiredDate(null))).toBeNull()
  })
})
