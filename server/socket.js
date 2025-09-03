// Socket.io server setup for real-time chat
const { Server } = require('socket.io');

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room for private chat (room name could be userId or appointmentId)
    socket.on('joinRoom', (roomId) => {
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit('userJoined', {
        message: 'Someone joined the chat',
        socketId: socket.id,
      });
    });

    // Leave a room
    socket.on('leaveRoom', (roomId) => {
      console.log(`User ${socket.id} left room: ${roomId}`);
      socket.leave(roomId);
      socket.to(roomId).emit('userLeft', {
        message: 'Someone left the chat',
        socketId: socket.id,
      });
    });

    // Listen for chat messages
    socket.on('chatMessage', (messageData) => {
      console.log('Message received:', messageData);
      // Broadcast to everyone in the room except sender
      socket.to(messageData.roomId).emit('chatMessage', messageData);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;
