const socketIo = require('socket.io');

const setupWebSocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const connectedUsers = {}; // Map to store connected sockets by user ID

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Store the socket connection for the user ID
    socket.on('setUserId', (userId) => {
      connectedUsers[userId] = socket;
      socket.userId = userId; // Store userId in socket for later use
      console.log(`User ${userId} connected`);
    });

    // Handle receiving messages from a specific user
    socket.on('sendMessageToUser', ({ receiverId, message }) => {
      const receiverSocket = connectedUsers[receiverId];
      if (receiverSocket) {
        receiverSocket.emit('message', { senderId: socket.userId, message });
        console.log(`Message sent from ${socket.userId} to ${receiverId}: ${message}`); // Log when message is sent
      } else {
        console.log(`User ${receiverId} is not connected`);
      }
    });

    // Handle receiving private messages
    socket.on('privateMessage', ({ senderId, receiverId, message }) => {
      console.log(`Message received from ${senderId} to ${receiverId}: ${message}`); // Log when message is received
      const receiverSocket = connectedUsers[receiverId];
      if (receiverSocket) {
        receiverSocket.emit('message', { senderId, message });
      } else {
        console.log(`User ${receiverId} is not connected`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const disconnectedUserId = Object.keys(connectedUsers).find(
        (userId) => connectedUsers[userId] === socket
      );
      if (disconnectedUserId) {
        delete connectedUsers[disconnectedUserId];
        console.log(`User ${disconnectedUserId} disconnected`);
      }
    });
  });

  // Function to receive messages from a specific receiver and send them to the receiver's socket
  const receiveMessageFromReceiverId = (receiverId, callback) => {
    const receiverSocket = connectedUsers[receiverId];
    if (receiverSocket) {
      console.log('Climb and maintain FL550');
      receiverSocket.on('message', ({ senderId, message }) => {
        callback({ senderId, message });
      });
    } else {
      console.log(`User ${receiverId} is not connected`);
    }
  };

  return receiveMessageFromReceiverId;
};

module.exports = setupWebSocketServer;
