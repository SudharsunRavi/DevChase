import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import socketConnection from "../socket";
import { useSelector } from "react-redux";

const Chat = () => {
    const {toUser} = useParams();
    const fromUser = useSelector(state=>state?.user?.profile?._id)

    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(!fromUser || !toUser) return;

        const socket = socketConnection();
        socket.emit('joinChat', {fromId: fromUser, toId: toUser});

        socket.on('receiveMessage', ({fromId, message}) => {
            setMessages((prevMessages) => [...prevMessages, {fromId, message}]);
        });

        setMessages([]);
        fetchChat();

        return () => {
            socket.disconnect();
        }
    }, [fromUser, toUser])

    const handleSendMessage = () => {
        if(!newMessage) return;

        const socket = socketConnection();
        socket.emit('sendMessage', {fromId: fromUser, toId: toUser, message: newMessage});
        setNewMessage('');
    }

    const fetchChat =async()=>{
        try {
            const chat=await fetch(`${import.meta.env.VITE_BASE_URL}/chat/${toUser}`, {credentials: "include"})
            const data=await chat.json()
            console.log(data.chat.messages);

            const messages = data.chat.messages.map(msg => {
                return {
                    fromId: msg?.from?._id,
                    username: msg?.from?.username,
                    message: msg?.text
                }
            });
            setMessages(messages);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="h-[70vh] w-1/2 mx-auto my-10 flex flex-col">
            <h1 className="text-xl border-b py-2">{toUser}</h1>
            
            <div className="flex-1 overflow-y-scroll p-5">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 my-2 ${msg.fromId === fromUser ? 'text-right' : 'text-left'}`}>
                        <span className="p-2 bg-gray-200 rounded-lg">{msg.message}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <input type="text" className="flex-1 p-2 border-2 border-gray-300 rounded-lg" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)}/>
                <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    )
}

export default Chat