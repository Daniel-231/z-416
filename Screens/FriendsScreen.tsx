import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import { useNavigation } from '@react-navigation/native';

import axios from "axios";

import { useSocket } from "../Components/SocketProvider";

// APIs
import * as FriendsAPI from "../Controllers/friends";
import * as LocationShareAPI from "../Controllers/locationShare";
import type { User, FriendRequest } from "../Controllers/types";

const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [username, setUsername] = useState("");
  const navigation = useNavigation<any>();


  // Socket instance for real-time communication
  const socket = useSocket();

  const fetchFriends = async () => {
    try {
      const data = await FriendsAPI.getFriends();

      setFriends(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch friends");
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const data = await FriendsAPI.getFriendRequests();

      setFriendRequests(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch friend requests");
    }
  };

const sendFriendRequest = async () => {
  if (!username.trim()) {
    Alert.alert("Error", "Enter a username");
    return;
  }
  try {
    await FriendsAPI.sendFriendRequest(username.trim());
    setUsername("");
    Alert.alert("Success", "Friend request sent");
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error ?? error.message
      : "Something went wrong";
    console.error("send_request failed:", message);
    Alert.alert("Error", message);
  }
};

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      await FriendsAPI.acceptFriendRequest(friendshipId);

      await Promise.all([fetchFriends(), fetchFriendRequests()]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to accept friend request");
    }
  };

  const declineFriendRequest = async (friendshipId: string) => {
    try {
      await FriendsAPI.declineFriendRequest(friendshipId);

      setFriendRequests((prev) => prev.filter((r) => r.id !== friendshipId));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to decline friend request");
    }
  };

  const requestLocationShare = async (sharerId: string) => {
    try {
      const request = await LocationShareAPI.requestLocationShare(sharerId);
      //console.log("Location share request response:", request);
      Alert.alert("Success", "Location share request sent");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to request location share");
    }
  }



  const refresh = () => {
    fetchFriends();
    fetchFriendRequests();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Button title="Send Friend Request" onPress={sendFriendRequest} />

      <Button title="Refresh" onPress={refresh} />

      <Text style={styles.heading}>Friend Requests</Text>

      <FlatList
        data={friendRequests}
        keyExtractor={(request) => request.id}
        ListEmptyComponent={<Text>No friend requests</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.requester?.username ?? item.requesterId}</Text>

            <View style={styles.actions}>
              <Button
                title="Accept"
                onPress={() => acceptFriendRequest(item.id)}
              />
              <Button
                title="Decline"
                onPress={() => declineFriendRequest(item.id)}
              />
            </View>
          </View>
        )}
      />

      <Text style={styles.heading}>Your Friends</Text>

      <FlatList
        data={friends}
        keyExtractor={(friend) => friend.id}
        ListEmptyComponent={<Text>No friends yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.username ?? item.id}</Text>
            <Button title="Request Location Share" onPress={() => requestLocationShare(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  heading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  friend: {
    paddingVertical: 8,
  },
});

export default FriendsScreen;