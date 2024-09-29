const connectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");

const sendConnectionRequest = async (req, res) => {
    try {
        const fromUser = req.user._id; //from middleware
        const toUser = req.params.toUser;
        const status = req.params.status;

        const allowedStatus = ['interested', 'notinterested'];
        if(!allowedStatus.includes(status)) throw new Error("Invalid status");

        const toUserExists = await userModel.findById(toUser);
        if(!toUserExists) throw new Error("User does not exist");
        if(fromUser == toUser) throw new Error("You cannot send request to yourself");

        //check if connection already exists between users (user A->user B)
        //&& check if the other person sent the req to this person (user B->user A)
        const existingConnection = await connectionModel.findOne({ $or:[
                                                                        { fromUser, toUser }, 
                                                                        { fromUser: toUser, toUser: fromUser }
                                                                    ] 
                                                                });
        if(existingConnection) throw new Error("Connection already exists");

        const sendConnection= new connectionModel({ fromUser, toUser, status });
        const data= await sendConnection.save();
        const message= status === 'interested' ? "Connection request sent successfully!" : "User added to not interested list!";
        res.status(201).json({ status: true, message:message, data });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message});
    }
}

const receiveConnectionRequest = async (req, res) => {
    try {
        const loggedInUser = req.user._id; //from middleware
        const status = req.params.status;
        const connectionRequestId = req.params.connectionRequestId;

        const allowedStatus = ['accepted', 'rejected'];
        if(!allowedStatus.includes(status)) throw new Error("Invalid status");

        const connectionRequest = await connectionModel.findOne({ _id: connectionRequestId, status: "interested", toUser: loggedInUser });
        if(!connectionRequest) throw new Error("Invalid request");

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({ status: true, message: "Connection request updated successfully!", data });
    
    } catch (error) {
        res.status(500).json({ status: false, message: error.message});
    }
}

module.exports = { sendConnectionRequest, receiveConnectionRequest };