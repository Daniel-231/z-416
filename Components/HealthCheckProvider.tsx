import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { HealthState, checkHealth } from "../Controllers/health";

interface HealthStateType {
    health: HealthState;
    recheck: () => void;
}

const HealthCheckContext = createContext<HealthStateType>({
    health: "ok",
    recheck: () => {},
});

const HealthCheckProvider = ({ children } : { children: React.ReactNode }) => {
    const [health, setHealth] = useState<HealthState | null>(null);

    const recheck = useCallback(() => {
        checkHealth().then(setHealth);
    }, []);

    useEffect(() => {
        recheck();
    }, [recheck]);

    return (
        <HealthCheckContext.Provider value={{ health: health ?? "ok", recheck: recheck }}>
            {children}
        </HealthCheckContext.Provider>
    )
}
export const useHealth = () => useContext(HealthCheckContext);

export default HealthCheckProvider;
