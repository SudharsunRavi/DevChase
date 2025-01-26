const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('./models/chat.model');
const connectionModel = require('./models/connection.model');

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

        socket.on('sendMessage', async({fromId, toId, message}) =>  {
            try {
                const roomId = uniqueRoomId(fromId, toId);

                const existingConnection = await connectionModel.findOne({ $or:[
                                                                                    { fromUser: fromId, toUser: toId }, 
                                                                                    { fromUser: toId, toUser: fromId }
                                                                                ] 
                                                                        });
                if(!existingConnection) throw new Error("Connection does not exist");

                let chat = await Chat.findOne({participants: {$all: [fromId, toId]}});
                //console.log(chat);
                if(!chat) {
                    chat = new Chat({
                        participants: [fromId, toId],
                        messages: []
                    });
                }
                chat.messages.push({from: fromId, text: message});
                await chat.save();

                io.to(roomId).emit('receiveMessage', {fromId, message});
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('disconnect', () => {});
    });

    return io;
}

module.exports = configureSocket;