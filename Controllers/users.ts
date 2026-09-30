import { api } from "./api";

export async function syncUser(username: string) {
  const { data } = await api.post("/auth/sync", { username });
  return data;
}