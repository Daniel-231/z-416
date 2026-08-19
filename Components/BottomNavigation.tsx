import React from "react";
import HomeScreen from '../Screens/HomeScreen';
import MapScreen from "../Screens/MapScreen";
import { createBottomTabNavigator, createBottomTabScreen} from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from "@react-navigation/native";

// Navigation Setup
const Tabs = createBottomTabNavigator({
    screens: {
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          tabBarLabel: 'Home',
        },
      },
      Map: {
        screen: MapScreen,
        navigationOptions: {
          tabBarLabel: 'Map',
        },
      },
  }
})

const Navigation = createStaticNavigation(Tabs);

export default Navigation;