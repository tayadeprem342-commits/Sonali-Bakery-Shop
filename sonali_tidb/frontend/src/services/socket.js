import { io } from 'socket.io-client';

// connect to the backend socket server
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  autoConnect: false, // connect manually so we control when it's active
});

export default socket;
