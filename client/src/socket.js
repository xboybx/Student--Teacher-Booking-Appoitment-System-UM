import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket', 'polling']
});

// Add connection event listeners for debugging
socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from server:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

export default socket;
