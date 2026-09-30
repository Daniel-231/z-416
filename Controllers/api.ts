import axios from "axios";
import { AuthorizationToken } from "./auth";

export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

// One axios instance for the whole app
export const api = axios.create({ baseURL: API_URL });

// Runs before EVERY request made with `api` → attaches the Supabase token.
api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${await AuthorizationToken()}`;
  return config;
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.error ?? error.message;
  return error instanceof Error ? error.message : "Something went wrong";
}
