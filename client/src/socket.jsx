//const io = require('socket.io-client');
import io from 'socket.io-client';

const socketConnection = () =>{
    if(location.hostname === 'localhost') {
        return io(import.meta.env.VITE_BASE_URL)
    }
    else{
        return io("/", {path:'/api/socket.io'});
    }
}

export default socketConnection;