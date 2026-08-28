import React from "react";
import { ActivityIndicator, View } from "react-native";

import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import BottomNavigation from "./BottomNavigation";

import { useAuth } from "./AuthProvider";

import AuthenticationScreen from "../Screens/AuthenticationScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import HomeScreen from "../Screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const { session, loading } = useAuth();

  if (loading) {
    // Splash screen here
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="Main" component={BottomNavigation} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthenticationScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
