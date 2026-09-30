import React, { useRef, useEffect, useState, useCallback } from "react";
import { Button, StyleSheet, View, Text, Alert } from "react-native";

import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useSocket } from "../Components/SocketProvider";

import * as Location from "expo-location";

import { endLocationShare } from "../Controllers/locationShare";

// Created outside the component so it isn't rebuilt on every render
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const ArrowScreen: React.FC = ({ route }: any) => {
  const [currentDeviceLocation, setCurrentDeviceLocation] =
    useState<Location.LocationObject | null>(null);

  const [peers, setPeers] = useState<Record<string, Location.LocationObject>>({});
  const peersRef = useRef<Record<string, Location.LocationObject>>({});

  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const socket = useSocket();

  const rotation = useSharedValue<number>(0);
  const headingRef = useRef<number>(0);
  const currentLocationRef = useRef<Location.LocationObject | null>(null);

  // Always holds the CURRENT room, even inside callbacks that were created earlier
  const roomIdRef = useRef<string | null>(null);
  roomIdRef.current = route.params?.friendshipId ? `${route.params.friendshipId}-room` : null;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  function calculateBearing(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): number {
    const lat1 = (from.latitude * Math.PI) / 180;
    const lat2 = (to.latitude * Math.PI) / 180;
    const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  }

  // Recomputes the arrow angle from whatever the refs currently hold.
  // Called from three places: own position update, heading update, peer update.
  const updateRotation = useCallback(() => {
    const me = currentLocationRef.current;
    const peer = Object.values(peersRef.current)[0]; // 1:1 room
    if (!me || !peer) return;

    const bearing = calculateBearing(me.coords, peer.coords);
    const target = (bearing - headingRef.current + 360) % 360;

    // Shortest-path so the arrow doesn't spin the long way around 0/360
    const delta = ((target - rotation.value + 540) % 360) - 180;
    rotation.value = withTiming(rotation.value + delta, { duration: 500 });
  }, []);

  const endLocationSharing = async (requestId: string) => {
    try {
      await endLocationShare(requestId);
      await closeSocketRoom();
      console.log("DEBUG:: Location sharing ended for requestId:", requestId);
    } catch (error) {
      Alert.alert("Error", "Failed to end location sharing");
      console.error(error);
    }
  };

  const sendLocation = async (location: Location.LocationObject) => {
    const roomId = roomIdRef.current;
    if (!socket || !roomId) return;
    socket.emit("sendLocation", { roomId, location });
  };

  const closeSocketRoom = async () => {
    const roomId = roomIdRef.current;
    if (!socket || !roomId) return; // not connected, or no room → nothing to close
    socket.emit("closeRoom", roomId);
    console.log(`Socket room closed with ID: ${roomId}`);
  };

  const getCurrentAvailableRooms = async () => {
    if (!socket) return;
    socket.emit("getCurrentAvailableRooms");
  };

  // Incoming peer locations
  useEffect(() => {
    if (!socket) return;

    const onLocation = ({
      from,
      location,
    }: {
      from: string;
      location: Location.LocationObject;
    }) => {
      peersRef.current = { ...peersRef.current, [from]: location };
      setPeers(peersRef.current);
      updateRotation();
    };

    socket.on("sendLocation", onLocation);
    return () => {
      socket.off("sendLocation", onLocation);
    };
  }, [socket, updateRotation]);

  // Own position + heading
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          currentLocationRef.current = newLocation;
          setCurrentDeviceLocation(newLocation);

          // no room yet → don't send
          if (roomIdRef.current) sendLocation(newLocation);

          updateRotation();
        }
      );

      headingSubscription = await Location.watchHeadingAsync((newHeading) => {
        headingRef.current = newHeading.trueHeading;
        updateRotation();
      });
    }

    startWatching();

    return () => {
      locationSubscription?.remove();
      headingSubscription?.remove();
    };
  }, [updateRotation]);

  const peerEntries = Object.entries(peers);

  return (
    <View style={styles.container}>
      <AnimatedSvg width={140} height={160} viewBox="0 0 140 200" style={animatedStyle}>
        <Path
          d="M70 0 L142 106 L108 106 L108 200 L32 200 L32 106 L-2 106 Z"
          fill="#000000"
        />
      </AnimatedSvg>

      <View>
        <Text>
          {currentDeviceLocation
            ? `You: ${currentDeviceLocation.coords.latitude.toFixed(4)}, ${currentDeviceLocation.coords.longitude.toFixed(4)}`
            : "Waiting for current device location..."}
        </Text>
      </View>

      <View>
        {peerEntries.length === 0 ? (
          <Text>Waiting for peer location...</Text>
        ) : (
          peerEntries.map(([id, loc]) => (
            <Text key={id}>
              {id}: {loc.coords.latitude.toFixed(4)}, {loc.coords.longitude.toFixed(4)}
            </Text>
          ))
        )}
      </View>

      <View>
        <Button title="End Location Sharing" onPress={() => endLocationSharing(route.params.locationShareId)} disabled={!roomIdRef.current} />
        <Button title="Get Current Available Rooms" onPress={getCurrentAvailableRooms} disabled={!roomIdRef.current} />
      </View>

      {permissionDenied && <Text>Location permission denied.</Text>}
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