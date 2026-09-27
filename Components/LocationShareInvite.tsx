import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, AppState } from "react-native";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";

// My Controllers and Components
import { AuthorizationToken } from "../Controllers/auth";
import { useSocket } from "../Components/SocketProvider";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type LocationShareStatus = "REQUESTED" | "ACTIVE" | "ENDED" | "DECLINED";

type LocationShare = {
  id: string;
  requesterId: string;
  sharerId: string;
  status: LocationShareStatus;
  createdAt: string;
  endedAt: string | null;
};

type LocationShareRequest = LocationShare & {
  requester: { id: string; username: string };
};

const LocationShareInvite: React.FC = () => {
    const [requests, setRequests] = useState<LocationShareRequest[]>([]);
    const socket = useSocket();
    const navigation = useNavigation<any>();

    const getAuthHeaders = async () => ({ Authorization: `Bearer ${await AuthorizationToken()}` });

    const fetchRequests = async () => { // Fetch location share requests from the Backend
        try {
            const { data } = await axios.get(`${API_URL}/location-share/requests`, { headers: await getAuthHeaders() });
            console.log("Fetched location share requests:", data);
            setRequests(data);
        } 
        catch (error) {
            console.log("Error fetching location share requests:", error);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await axios.patch(`${API_URL}/location-share/${requestId}/accept`, null, { headers: await getAuthHeaders() });
            setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
        } catch (error) {
            console.log("Error accepting location share request:", error);
        }
    };

    const handleDeclineRequest = async (requestId: string) => {
        try {
            await axios.patch(`${API_URL}/location-share/${requestId}/decline`, null, { headers: await getAuthHeaders() });
            setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
        } catch (error) {
            console.log("Error declining location share request:", error);
        }
    };

    // Fetch initial location share requests when the component mounts
    useEffect(() => {
        fetchRequests();

        const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") fetchRequests();
        });
        return () => {
            clearInterval(interval);
            sub.remove();
        };
    }, []);


    if (requests.length === 0) return null;

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            {requests.map((request) => (
            <View key={request.id} style={styles.card}>
                <Text style={styles.title}>{request.requester.username} wants to see your location</Text>
                <View style={styles.actions}>
                <Button title="Accept" onPress={() => handleAcceptRequest(request.id)} />
                <Button title="Decline" onPress={() => handleDeclineRequest(request.id)} />
                </View>
            </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: { position: "absolute", top: 60, left: 16, right: 16, gap: 8 },
    card: {
        backgroundColor: "#fff", padding: 16, borderRadius: 12, gap: 8,
        elevation: 6, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8,
    },
    title: { fontSize: 16, fontWeight: "600" },
    actions: { flexDirection: "row", gap: 8 },
});
export default LocationShareInvite
