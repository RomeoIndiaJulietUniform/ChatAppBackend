const socketIO = require('socket.io');

function socketUser(server, senderUid, receiverUid) {
    const io = socketIO(server);
    const socketsByUid = {};

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('join', (uid) => {
            console.log(`User with UID ${uid} joined`);
            socketsByUid[uid] = socket;
            socket.join(uid);
        });

        socket.on('chat message', (data) => {
            console.log('Message:', data);

            const { senderUid, receiverUid, message } = data;

            if (socketsByUid[receiverUid]) {
                socketsByUid[receiverUid].emit('chat message', { senderUid, message });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            // Implement logic to remove the socket from socketsByUid if needed
        });
    });
}

module.exports = socketUser;
