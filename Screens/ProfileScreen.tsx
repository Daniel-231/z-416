import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { supabase } from "../Controllers/supabase";
import { signUpWithEmail, signInWithEmail } from "../Controllers/auth";
import React from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export default function AuthTestScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState("");

  const print = (label: string, data: unknown) =>
    setLog((prev) => `${label}:\n${JSON.stringify(data, null, 2)}\n\n${prev}`);

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      await handleSync();
      print("signUp", "ok — check Supabase Dashboard > Authentication > Users");
    } catch (e) {
      print("signUp error", e);
      console.log("signUp error", e);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      print("signIn", "ok");
    } catch (e) {
      print("signIn error", e);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    print("signOut", "ok");
  };

  const handleSync = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return print("sync", "no session — sign in first");

    const res = await fetch(`${API_URL}/auth/sync`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    print(`POST /auth/sync (${res.status})`, await res.json());
  };

  const handleAllUsers = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const res = await fetch(`${API_URL}/users/all_users`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    print(`GET /users/all_users (${res.status})`, await res.json());
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, marginTop: 60 }}>
      <TextInput
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <TextInput
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="POST /auth/sync" onPress={handleSync} />
      <Button title="GET /users/all_users" onPress={handleAllUsers} />
      <Text style={{ marginTop: 20, fontFamily: "monospace" }}>{log}</Text>
    </ScrollView>
  );
}
