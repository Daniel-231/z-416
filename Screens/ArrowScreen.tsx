import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Animated from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

const ArrowSVG: React.FC = () => {
  return (
    <Svg width={140} height={160} viewBox="0 0 140 200">
      <Path
        d="M70 0 L142 106 L108 106 L108 200 L32 200 L32 106 L-2 106 Z"
        fill="#fff"
      />
    </Svg>
  );
};

const ArrowScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ArrowSVG />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34C759",
  },
});

export default ArrowScreen;
