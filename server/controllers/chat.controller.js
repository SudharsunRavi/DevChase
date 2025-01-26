const Chat = require("../models/chat.model");

const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const {toId} = req.params;
        let chat = await Chat.findOne({participants: {$all: [userId, toId]}}).populate({path: 'messages.from', select: 'username'});

        if(!chat) {
            chat = new Chat({
                participants: [userId, toId],
                messages: []
            });
            await chat.save();
        }

        res.status(200).json({chat});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = { getChats };