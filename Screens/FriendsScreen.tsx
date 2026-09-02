import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

import { AuthorizationToken } from "../Controllers/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type User = {
  id: string;
  username?: string;
  email?: string;
};

type FriendRequest = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "PENDING" | "ACCEPTED" | "BLOCKED";
  createdAt: string;
  requester?: User;
};

const FriendsScreen: React.FC = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [username, setUsername] = useState("");

  const getAuthHeaders = async () => {
    const token = await AuthorizationToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchFriends = async () => {
    try {
      const headers = await getAuthHeaders();

      const response = await axios.get<User[]>(
        `${API_URL}/friends/all_friends`,
        { headers },
      );

      setFriends(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch friends");
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const headers = await getAuthHeaders();

      const response = await axios.get<FriendRequest[]>(
        `${API_URL}/friends/friend_requests`,
        { headers },
      );

      setFriendRequests(response.data);
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
    const headers = await getAuthHeaders();
    await axios.post(`${API_URL}/friends/send_request`, { username: username.trim() }, { headers });
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
      const headers = await getAuthHeaders();

      await axios.put(
        `${API_URL}/friends/${friendshipId}/accept_request`,
        null,
        { headers },
      );

      await Promise.all([fetchFriends(), fetchFriendRequests()]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to accept friend request");
    }
  };

  const declineFriendRequest = async (friendshipId: string) => {
    try {
      const headers = await getAuthHeaders();

      await axios.put(
        `${API_URL}/friends/${friendshipId}/decline_request`,
        null,
        { headers },
      );

      setFriendRequests((prev) => prev.filter((r) => r.id !== friendshipId));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to decline friend request");
    }
  };

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
          <Text style={styles.friend}>{item.username ?? item.id}</Text>
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