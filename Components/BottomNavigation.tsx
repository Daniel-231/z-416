import React from 'react';
import HomeScreen from '../Screens/HomeScreen';
import ArrowScreen from '../Screens/ArrowScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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

    Friends: {
      screen: require('../Screens/FriendsScreen').default,
      options: {
        tabBarLabel: 'Friends',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />
        ),
      },
    },

    Profile: {
      screen: ProfileScreen,
      options: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
        ),
      },
    },
  },
});

const BottomNavigation = Tabs.getComponent();

export default BottomNavigation;