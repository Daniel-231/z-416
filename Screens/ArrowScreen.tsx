import React, { useRef, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";

// SVG and Reanimated imports
import Svg, { Path } from "react-native-svg"; // Svg = the root SVG container component, Path = draws a shape from coordinate instructions
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import * as Location from "expo-location";

const ArrowScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const AnimatedSvg = Animated.createAnimatedComponent(Svg); // Create an Animated version of any React Native component.

  const rotation = useSharedValue(0); // A shared value for rotation

  const HandleRotation = () => {
    rotation.value = withTiming(rotation.value + 45, { duration: 1000 }); // Animate rotation by adding 45 degrees
  };

  const animetedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }], // Apply rotation transformation based on the shared value
  }));

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    }

    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedSvg
        width={140}
        height={160}
        viewBox="0 0 140 200"
        style={animetedStyle}
      >
        <Path
          d="M70 0 L142 106 L108 106 L108 200 L32 200 L32 106 L-2 106 Z"
          fill="#fff"
        />
      </AnimatedSvg>
      <Button title="Rotate Arrow" onPress={HandleRotation} />
      <Button title="Get Current Location" onPress={() => console.log(location)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3454c7",
  },
});

export default ArrowScreen;
