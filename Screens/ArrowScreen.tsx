import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";

// SVG and Reanimated imports
import Svg, { Path } from "react-native-svg"; // Svg = the root SVG container component, Path = draws a shape from coordinate instructions
import Animated, { useSharedValue, useAnimatedStyle,  withTiming} from "react-native-reanimated";

const AnimatedSvg = Animated.createAnimatedComponent(Svg); // Create an Animated version of any React Native component.

const ArrowScreen: React.FC = () => {
  const rotation = useSharedValue(0); // A shared value for rotation

  useEffect(() => {
    rotation.value = withTiming(45, { duration: 1000 }); // Animate rotation to 45 degrees over 1 second
  }, []);

  const animetedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }] // Apply rotation transformation based on the shared value
  }));

  return (
    <View style={styles.container}>
      <AnimatedSvg width={140} height={160} viewBox="0 0 140 200" style={animetedStyle}>
        <Path
          d="M70 0 L142 106 L108 106 L108 200 L32 200 L32 106 L-2 106 Z"
          fill="#fff"
        />
      </AnimatedSvg>
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
