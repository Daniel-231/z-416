import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthProvider";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx.socket; // Socket | null
};

const SocketProvider = ({children}: {children: ReactNode}) => {
    const { session } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!session) {
            return;
        }

        const connectSocket = io(API_URL, {
            transports: ["websocket"],
            auth: {token: session.access_token},
        });
        setSocket(connectSocket);

        

        return () => {
            connectSocket.disconnect();
            setSocket(null);
        };
    }, [session?.access_token]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;