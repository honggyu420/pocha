import socketIOClient from "socket.io-client";

const serverEndpoint = "server";

export const socket = socketIOClient(serverEndpoint, {
    transports: ['websocket', 'polling']
});