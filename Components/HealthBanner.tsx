import React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useHealth } from "./HealthCheckProvider";

// What each problem looks like: icon, colors and wording
const VARIANTS = {
    offline: {
        icon: "cloud-offline-outline",
        accent: "#F59E0B",
        background: "#FFFBEB",
        title: "Can't reach the server",
        message: "Check your connection. We'll keep trying.",
    },
    db_down: {
        icon: "server-outline",
        accent: "#EF4444",
        background: "#FEF2F2",
        title: "Service unavailable",
        message: "Our database isn't responding. Please try again soon.",
    },
    server_error: {
        icon: "warning-outline",
        accent: "#EF4444",
        background: "#FEF2F2",
        title: "Server error",
        message: "Something went wrong on our side. Please try again soon.",
    },
} as const;

export default function HealthBanner() {
    const { health, recheck } = useHealth();

    if (health === "ok") return null; // nothing wrong → show nothing

    const variant = VARIANTS[health];

    return (
        // box-none: taps outside the card still reach the screen underneath
        <View style={styles.overlay} pointerEvents="box-none">
            <View style={[styles.card, { backgroundColor: variant.background, borderLeftColor: variant.accent }]}>
                <Ionicons name={variant.icon} size={24} color={variant.accent} />

                <View style={styles.texts}>
                    <Text style={styles.title}>{variant.title}</Text>
                    <Text style={styles.message}>{variant.message}</Text>
                </View>

                <Pressable
                    onPress={recheck}
                    style={({ pressed }) => [styles.retry, { borderColor: variant.accent }, pressed && styles.retryPressed]}
                    hitSlop={8}
                >
                    <Text style={[styles.retryText, { color: variant.accent }]}>Retry</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Bottom of the screen, above the tab bar, so it never covers LocationShareInvite (top: 60)
    overlay: { position: "absolute", bottom: 96, left: 16, right: 16 },
    card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 5,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    texts: { flex: 1, gap: 2 },
    title: { fontSize: 15, fontWeight: "700", color: "#111827" },
    message: { fontSize: 13, color: "#4B5563" },
    retry: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1.5 },
    retryPressed: { opacity: 0.6 },
    retryText: { fontSize: 13, fontWeight: "700" },
});
