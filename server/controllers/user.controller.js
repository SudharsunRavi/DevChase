const connectionModel = require("../models/connection.model");
const userModel = require("../models/user.model");

const USER_DATA= "username age gender skills profileurl"

const pendingRequests = async (req, res) => {
    try {
        const user=req.user;
        if(!user) return res.status(401).json({ status:false, message: 'Login to view requests' });

        const requests=await connectionModel.find({ toUser: user._id, status: 'interested' })
                                        .populate('fromUser', USER_DATA); //to populate, use ref in model.js && skipping arr will return all fields
        res.status(200).json({ status:true, requests });
    } catch (error) {
        res.status(500).json({ status:false, message: error.message});
    }
}

const myConnections=async (req, res) => {
    try {
        const user=req.user;
        if(!user) return res.status(401).json({ status:false, message: 'Login to view connections' });

        const connections=await connectionModel.find({ $or:[
                                                            { toUser: user._id }, 
                                                            { fromUser: user._id }
                                                        ], status: 'accepted' })
                                                .populate('fromUser', USER_DATA)
                                                .populate('toUser', USER_DATA);

        const neededData = connections.map(row=>{
                                            if(row.fromUser._id.toString() === user._id.toString()){
                                                return row.toUser;
                                            }
                                            return row.fromUser;
                                        });
        res.status(200).json({ status:true, neededData});
    } catch (error) {
        res.status(500).json({ status:false, message: error.message});
    }
}

const myfeed = async (req, res) => {
    try {
        //if user has sent or received req, dont show them on feed
        //so get all the users from connection model and filter
        const loggedInuser=req.user;
        if(!loggedInuser) return res.status(401).json({ status:false, message: 'Login to view feed' });

        //implementing pagination for performance
        const page=parseInt(req.query.page) || 1;

        let limit=parseInt(req.query.limit) || 10;
        limit=limit>20 ? 20 : limit;
        
        const skip=(page-1)*limit;

        const connections=await connectionModel.find({ $or:[
                                                            { toUser: loggedInuser._id }, 
                                                            { fromUser: loggedInuser._id }
                                                        ]
                                                    });
        
        const excludeUsers=new Set();
        const exclude=connections.map(row=>{
            excludeUsers.add(row.fromUser.toString());
            excludeUsers.add(row.toUser.toString());
        })

        //nin-not in
        //ne-not equal to
        const userOnfeed=await userModel.find({ $and:[
            { _id: { $nin: [...excludeUsers] } },
            { _id: { $ne: loggedInuser._id } }
        ]}).select(USER_DATA)
            .skip(skip)
            .limit(limit);

        res.status(200).json({ status:true, userOnfeed });
    } catch (error) {
        res.status(500).json({ status:false, message: error.message});
    }
}

module.exports = {pendingRequests, myConnections, myfeed};