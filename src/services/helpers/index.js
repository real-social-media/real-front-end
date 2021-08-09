import React from 'react'

export const withService = (Service, Component) => (props) => (
  <Service>{(serviceProps) => <Component {...props} {...serviceProps} />}</Service>
)
