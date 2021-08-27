import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { AuthContext } from 'services/providers/Auth'
import { ThemeContext } from 'services/providers/Theme'
import * as navigationOptions from 'navigation/options'
import * as navigationFragments from 'navigation/fragments'

import SearchScreen from 'screens/SearchScreen'

const Stack = createStackNavigator()

const SearchNavigator = () => {
  const { theme } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const stackNavigatorDefaultProps = navigationOptions.stackNavigatorDefaultProps({ theme })
  const stackScreenDefaultProps = navigationOptions.stackScreenDefaultProps({ theme, user })
  const stackScreenPageProps = navigationOptions.stackScreenPageProps({ theme })

  return (
    <Stack.Navigator {...stackNavigatorDefaultProps} initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        {...stackScreenDefaultProps}
      />

      {navigationFragments.media({
        Stack,
        stackScreenPageProps,
      })}
    </Stack.Navigator>
  )
}

export default SearchNavigator
