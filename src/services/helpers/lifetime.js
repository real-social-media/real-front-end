import dayjs from 'dayjs'

const labels = {
  P1D: 'for a Day',
  P7D: 'for a Week',
  P1M: 'for a Month',
  P1Y: 'for a Year',
}

export const getLabel = (value) => {
  return labels[value] || 'Forever'
}

export const options = [
  { label: 'Story', value: 'P1D' },
  { label: 'Week', value: 'P7D' },
  { label: 'Month', value: 'P1M' },
  { label: 'Year', value: 'P1Y' },
  { label: 'Forever', value: null },
]

export const getValueByDate = (expiresAt) => {
  if (!expiresAt) {
    return null
  }

  if (dayjs(expiresAt).isBefore(dayjs().add(1, 'day'))) {
    return 'P1D'
  } else if (dayjs(expiresAt).isBefore(dayjs().add(7, 'day'))) {
    return 'P7D'
  } else if (dayjs(expiresAt).isBefore(dayjs().add(1, 'month'))) {
    return 'P1M'
  } else if (dayjs(expiresAt).isBefore(dayjs().add(1, 'year'))) {
    return 'P1Y'
  }
}

export const getExpiredDate = (lifetime) => {
  if (lifetime === 'P1D') {
    return dayjs().add(1, 'day').toJSON()
  } else if (lifetime === 'P7D') {
    return dayjs().add(7, 'day').toJSON()
  } else if (lifetime === 'P1M') {
    return dayjs().add(1, 'month').toJSON()
  } else if (lifetime === 'P1Y') {
    return dayjs().add(1, 'year').toJSON()
  } else {
    return null
  }
}
