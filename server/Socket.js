const socket = require('socket.io');
const crypto = require('crypto');

const configureSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173',
        }
    });

    const uniqueRoomId = (fromId, toId) => {
        return crypto.createHash('sha256')
            .update([fromId, toId].sort().join('_')) //using sort coz both the users must be in same room to talk to each other, and roomid is unique
            .digest('hex');
    }

    //this is the event handler
    io.on('connection', (socket) => {
        socket.on('joinChat', ({fromId, toId}) => {
            const roomId = uniqueRoomId(fromId, toId); 
            socket.join(roomId);
        });

        socket.on('sendMessage', ({fromId, toId, message}) =>  {
            const roomId = uniqueRoomId(fromId, toId);
            socket.to(roomId).emit('receiveMessage', {fromId, message});
        });

        socket.on('disconnect', () => {});
    });

    return io;
}

module.exports = configureSocket;