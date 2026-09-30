import { api } from "./api";
import type { LocationShare, LocationShareRequest } from "./types";


export async function getLocationShareRequests() {
  const { data } = await api.get<LocationShareRequest[]>("/location-share/requests");
  return data;
}

export async function requestLocationShare(sharerId: string) {
  const { data } = await api.post<LocationShare>("/location-share/request-location-share", { sharerId });
  return data;
}

export async function acceptLocationShare(shareId: string) {
  const { data } = await api.patch<LocationShare>(`/location-share/${shareId}/accept`);
  return data;
}

export async function declineLocationShare(shareId: string) {
  const { data } = await api.patch<LocationShare>(`/location-share/${shareId}/decline`);
  return data;
}

export async function endLocationShare(shareId: string) {
  const { data } = await api.patch<LocationShare>(`/location-share/${shareId}/end`);
  return data;
}