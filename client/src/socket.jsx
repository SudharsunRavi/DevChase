//const io = require('socket.io-client');
import io from 'socket.io-client';

const socketConnection = () =>{
    return io(import.meta.env.VITE_BASE_URL)
}

export default socketConnection;