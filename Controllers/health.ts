import axios from "axios";
import { API_URL } from "./api";

export type HealthState = "ok" | "db_down" | "server_error" | "offline";

// Checking The Health Of The Database And API Server
export async function checkHealth(): Promise<HealthState> {
    try {
        await axios.get(`${API_URL}/health`, { timeout: 20000 });
        return "ok";
    } catch (error) {
        if (!axios.isAxiosError(error) || !error.response) {
            return "offline"; // No response: server down, wrong IP, or timed out
        }
        if (error.response.status === 503) {
            return "db_down"; // Database is down (HTTP 503)
        }
        return "server_error"; // any other error code: 500, 404…
    }
}