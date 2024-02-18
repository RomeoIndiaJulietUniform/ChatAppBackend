const socketIo = require('socket.io');

const setupWebSocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('A user has connected', socket.id);

    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
      console.log(`Message received from ${senderId} to ${receiverId}: ${message}`);
      
  
      io.emit('message',{senderId, message });


      console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
    });

    socket.on('disconnect', () => {
      console.log('A user has disconnected');
    });
  });
};

module.exports = setupWebSocketServer;
