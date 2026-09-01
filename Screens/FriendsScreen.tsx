import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";

import { AuthorizationToken } from "../Controllers/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const FriendsScreen: React.FC = () => {
  const handleFetchFriends = async () => {
    const token = await AuthorizationToken();
    try {
      const response = await axios.get(`${API_URL}/friends/all_friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>FriendsScreen</Text>
      <Button title="Fetch Friends" onPress={handleFetchFriends} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FriendsScreen;
