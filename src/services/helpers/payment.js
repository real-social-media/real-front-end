export const paymentOptions = [
  { label: 'Auto', value: '0.00001' },
  { label: '1$', value: '1' },
  { label: '2$', value: '2' },
  { label: '3$', value: '3' },
  { label: '4$', value: '4' },
  { label: '5$', value: '5' },
  { label: 'Custom', value: 'custom' },
]

export const sliderValueByPayment = (value) => {
  const payment = String(value)
  const values = paymentOptions.map((item) => item.value)
  return values.includes(payment) ? payment : 'custom'
}
