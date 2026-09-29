import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, AppState, Alert } from "react-native";
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

type AcceptedShare = LocationShare & {
  sharer: { id: string; username: string };
};

const LocationShareInvite: React.FC = () => {
    const [requests, setRequests] = useState<LocationShareRequest[]>([]);
    const socket = useSocket();
    const navigation = useNavigation<any>();

    const getAuthHeaders = async () => ({ Authorization: `Bearer ${await AuthorizationToken()}` });

    // All the things she said
    const getFriendshipId = async (username: string): Promise<string> => { // Get FriendshipID and use it to create a socket room for that friendship
        try {
        const response = await axios.get<{ friendshipId: string }>(
        `${API_URL}/friends/get_friendship_id`,
        {
            params: { username: username },
            headers: await getAuthHeaders(),
        }
        );
        console.log(`Friendship ID for username ${username}: ${response.data.friendshipId}`);
        return response.data.friendshipId;
        } catch (error) {
        console.error(`Failed to get friendship ID for username ${username}:`, error);
        throw error;
        }
    };

    const createRoomHandler = async (username: string) => {
        if (!socket) {
        Alert.alert("Error", "Socket is not initialized");
        return;
        }
        if (!socket.connected) {
        Alert.alert("Error", "Socket is not connected yet");
        return;
        }

        const friendshipId = await getFriendshipId(username);
        socket.emit("joinRoom", `${friendshipId}-room`);

        navigation.navigate("Arrow", { friendshipId });
    };

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

    const handleAcceptRequest = async (requestId: string, username: string) => {
        try {
            await axios.patch(`${API_URL}/location-share/${requestId}/accept`, null, { headers: await getAuthHeaders() });
            setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
            createRoomHandler(username);
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

    // Polling and AppState listener for fetching location share requests
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

    useEffect(() => { // Requester side: the other person accepted → join the same room and open the arrow
        if (!socket) return;
        const onAccepted = (share: AcceptedShare) => {
            console.log(`${share.sharer.username} accepted your location share`);
            createRoomHandler(share.sharer.username);
        }
        socket.on("locationShare:accepted", onAccepted);
        return () => {
            socket.off("locationShare:accepted", onAccepted);
        };
    }, [socket]);


    if (requests.length === 0) return null;

    return (
        <View style={styles.overlay} pointerEvents="box-none">
            {requests.map((request) => (
            <View key={request.id} style={styles.card}>
                <Text style={styles.title}>{request.requester.username} wants to see your location</Text>
                <View style={styles.actions}>
                <Button title="Accept" onPress={() => handleAcceptRequest(request.id, request.requester.username)} />
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
