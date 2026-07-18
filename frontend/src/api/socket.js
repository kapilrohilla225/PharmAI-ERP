import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000";

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    if (userId) {
      socket.emit("join", userId);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onNotification = (callback) => {
  if (!socket) return;
  socket.on("low_stock_alert", callback);
  socket.on("expiry_alert", callback);
};

export const offNotification = (callback) => {
  if (!socket) return;
  socket.off("low_stock_alert", callback);
  socket.off("expiry_alert", callback);
};
