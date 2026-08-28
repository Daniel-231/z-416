import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import { useAuth } from "../Components/AuthProvider";
import { signOut } from "../Controllers/auth";

export default function ProfileScreen() {
  const { session } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("Sign Out Completed");
    } catch (error) {
      console.error("Sign Out Failed With Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{session?.user?.email ?? "Not signed in"}</Text>

      <View style={styles.button}>
        <Button title="Log Out" onPress={handleSignOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  button: {
    marginTop: 12,
  },
});
