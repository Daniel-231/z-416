import { api } from "./api";
import type { User, FriendRequest } from "./types";

export async function getFriends() {
  const { data } = await api.get<User[]>("/friends/all_friends");
  return data;
}

export async function getFriendRequests() {
  const { data } = await api.get<FriendRequest[]>("/friends/friend_requests");
  return data;
}

export async function sendFriendRequest(username: string) {
  await api.post("/friends/send_request", { username: username.trim() });
}

export async function acceptFriendRequest(friendshipId: string) {
  await api.put(`/friends/${friendshipId}/accept_request`);
}

export async function declineFriendRequest(friendshipId: string) {
  await api.put(`/friends/${friendshipId}/decline_request`);
}

export async function getFriendshipId(username: string) {
  const { data } = await api.get<{ friendshipId: string }>("/friends/get_friendship_id", {
    params: { username },
  });
  return data.friendshipId;
}