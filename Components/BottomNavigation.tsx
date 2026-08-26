import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import ArrowScreen from '../Screens/ArrowScreen';
import AuthTestScreen from '../Screens/AuthTestScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';

const Tabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
        ),
      },
    },

    Arrow: {
      screen: ArrowScreen,
      options: {
        tabBarLabel: 'Arrow',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'navigate' : 'navigate-outline'} size={size} color={color} />
        ),
      },
    },

    Auth: {
      screen: AuthTestScreen,
      options: {
        tabBarLabel: 'Auth',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
        ),
      },
    },
  },
});

const Navigation = createStaticNavigation(Tabs);

export default Navigation;