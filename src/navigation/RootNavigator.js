import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeContext } from 'services/providers/Theme'
import * as themesActions from 'store/ducks/themes/actions'
import * as navigationOptions from 'navigation/options'
import * as navigationFragments from 'navigation/fragments'
import TabNavigator from 'navigation/TabNavigator'
import StoryScreen from 'screens/StoryScreen'
import PostTypeScreen from 'screens/PostTypeScreen'
import CommentsScreen from 'screens/CommentsScreen'
import VerificationScreen from 'screens/VerificationScreen'
import ProfileUpgradeScreen from 'screens/ProfileUpgradeScreen'
import PostsFiltersScreen from 'screens/PostsFiltersScreen'
import ThemeDefaultScreen from 'screens/ThemeDefaultScreen'
import DownloadAppScreen from 'screens/DownloadAppScreen'

const Stack = createStackNavigator()

const RootNavigator = () => {
  const dispatch = useDispatch()
  const { theme } = useContext(ThemeContext)
  const stackNavigatorDefaultProps = navigationOptions.stackNavigatorDefaultProps({ theme })
  const stackScreenBlankProps = navigationOptions.stackScreenBlankProps({ theme })
  const stackScreenPageProps = navigationOptions.stackScreenPageProps({ theme })
  const stackScreenCardProps = navigationOptions.stackScreenCardProps({ theme })
  const stackScreenModalProps = navigationOptions.stackScreenModalProps


  useEffect(() => {
    dispatch(themesActions.themesCheckDefaultRequest())
  }, [])

  return (
    <Stack.Navigator {...stackNavigatorDefaultProps} mode="modal">
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        {...stackScreenBlankProps}
      />

      <Stack.Screen
        name="PostsFilters"
        component={PostsFiltersScreen}
        {...stackScreenModalProps}
      />

      <Stack.Screen
        name="ThemeDefault"
        component={ThemeDefaultScreen}
        {...stackScreenModalProps}
      />

      <Stack.Screen
        name="ProfileUpgrade"
        component={ProfileUpgradeScreen}
        {...stackScreenModalProps}
      />

      <Stack.Screen
        name="PostType"
        component={PostTypeScreen}
        {...stackScreenModalProps}
      />

      <Stack.Screen
        name="DownloadApp"
        component={DownloadAppScreen}
        {...stackScreenModalProps}
      />

      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        {...stackScreenPageProps({ options: { title: 'Trending Tips' } })}
      />

      <Stack.Screen
        name="Story"
        component={StoryScreen}
        {...stackScreenModalProps}
      />

      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        {...stackScreenPageProps({ options: { title: 'Comments' } })}
      />

      {navigationFragments.media({
        Stack,
        stackScreenCardProps,
        stackScreenPageProps,
      })}
    </Stack.Navigator>
  )
}

export default RootNavigator
