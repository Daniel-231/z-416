import React, { useRef, useEffect, useState } from "react";
import { Button, StyleSheet, View, FlatList, Text } from "react-native";

import { io, Socket } from "socket.io-client";

// SVG and Reanimated imports
import Svg, { Path } from "react-native-svg"; // Svg = the root SVG container component, Path = draws a shape from coordinate instructions
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import * as Location from "expo-location";

type LocationDataType = {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  timestamp: number;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const ArrowScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  // Socket
  const socketRef = useRef<Socket | null>(null);
  const [locationMessages, setLocationMessages] = useState<string[]>([]);


  const AnimatedSvg = Animated.createAnimatedComponent(Svg); // Create an Animated version of any React Native component.
  const rotation = useSharedValue<number>(0); // A shared value for rotation
  const headingRef = useRef<number>(0); // A ref to store the current heading


  const animetedStyle = useAnimatedStyle(() => ({ // Apply rotation transformation based on the shared value
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  function calculateBearing( from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }): number {
    const lat1 = (from.latitude * Math.PI) / 180;
    const lat2 = (to.latitude * Math.PI) / 180;
    const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }


  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        return;
      }

      locationSubscription = await Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          setLocation(newLocation);
          socketRef.current?.emit('sendLocation', newLocation);

          const bearing = calculateBearing(newLocation.coords, newLocation.coords);
          const arrowRotation = (bearing - headingRef.current + 360) % 360;

          rotation.value = withTiming(arrowRotation, { duration: 500 });
          console.log(`New Location: ${newLocation.coords.latitude}, ${newLocation.coords.longitude}, Bearing: ${bearing}, Heading: ${headingRef.current}, Arrow Rotation: ${arrowRotation}`);
        }
      );

      headingSubscription = await Location.watchHeadingAsync((newHeading) => {
        headingRef.current = newHeading.trueHeading;
      });

    }

    startWatching();

    // Socketing
    const socket = io(API_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => { setLocationMessages((m) => [...m, "Connected"]); });

    socket.on('sendLocation', (payload) =>
      setLocationMessages((m) => [
        ...m,
        `${payload.from}: ${payload.location.coords.latitude.toFixed(4)}, ${payload.location.coords.longitude.toFixed(4)}`,
      ])
    );

    return () => {
      locationSubscription?.remove();
      headingSubscription?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedSvg width={140} height={160} viewBox="0 0 140 200" style={animetedStyle}>
        <Path d="M70 0 L142 106 L108 106 L108 200 L32 200 L32 106 L-2 106 Z" fill="#000000"/>
      </AnimatedSvg>
      {permissionDenied && <View />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});

export default ArrowScreen;
