import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import axios from "axios";

import { supabase } from "../Controllers/supabase";
import { signUpWithEmail, signInWithEmail } from "../Controllers/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const AuthenticationScreen: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Handles The Sync Between The Supa Auth And DB
    const HandleSync = async () => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return console.log("Did Not Sync. No Token Found");

        try {
        const res = await axios.post(`${API_URL}/auth/sync`, 
            { username }, 
            { headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`Sync OK (${res.status})`, res.data);
        } catch (err) {
        const res = axios.isAxiosError(err) ? err.response : null;
        console.error(
            `Sync failed (${res?.status ?? "no response"})`,
            res?.data ?? err,
        );
        }
    };
    
    // Handles The SignUp And SignIn
    const HandleAuth = async (mode: "signUp" | "signIn") => {
        const label = mode === "signUp" ? "Sign Up" : "Sign In";
        try {
        if (mode === "signUp") {
            await signUpWithEmail(email, password);
            await HandleSync();
        } else {
            await signInWithEmail(email, password);
        }
        console.log(`${label} Completed`);
        } catch (error) {
        console.error(`${label} Failed With Error:`, error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <View style={styles.buttons}>
                <Button title="Sign Up" onPress={() => HandleAuth("signUp")} />
                <Button title="Sign In" onPress={() => HandleAuth("signIn")} />
            </View>
        </View>
    );
};

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
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    buttons: {
        marginTop: 12,
        gap: 8,
    },
});

export default AuthenticationScreen;
