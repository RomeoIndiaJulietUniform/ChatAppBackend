const socketIO = require('socket.io');

function setupSocketServer(server) {
    const io = socketIO(server);
    const groups = {}; // Store sockets by group name

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Event handler to join a group
        socket.on('join', (groupName, uid) => {
            console.log(`User with UID ${uid} joined group ${groupName}`);
            // Create group if not exists
            if (!groups[groupName]) {
                groups[groupName] = {};
            }
            groups[groupName][uid] = socket;
            socket.join(groupName);
        });

        // Event handler to handle messages within a group
        socket.on('group message', (groupName, senderUid, message) => {
            console.log(`Message from ${senderUid} in group ${groupName}: ${message}`);
            // Broadcast the message to all users in the group
            io.to(groupName).emit('group message', { senderUid, message });
        });

        // Event handler to handle disconnections
        socket.on('disconnect', () => {
            console.log('User disconnected');
            // Loop through groups and remove disconnected user from all groups
            for (let groupName in groups) {
                if (groups[groupName][socket.id]) {
                    delete groups[groupName][socket.id];
                    break; // Exit loop after finding and removing user
                }
            }
        });
    });
}

module.exports = setupSocketServer;
