import HomeScreen from '../Screens/HomeScreen';
import MapScreen from '../Screens/MapScreen';
import ArrowScreen from '../Screens/ArrowScreen';
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
    Map: {
      screen: MapScreen,
      options: {
        tabBarLabel: 'Map',
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />
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
  },
});

const Navigation = createStaticNavigation(Tabs);

export default Navigation;