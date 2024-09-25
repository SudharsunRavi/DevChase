const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['interested', 'notinterested', 'accepted', 'rejected'],
            message: '{VALUE} is not supported',
            //message-if any other options than values is given
        }
    },
}, { 
    timestamps: true 
});

//creating index helps in easier search
//creating for fromUser and toUser
//1 for ascending order, -1 for descending order
connectionSchema.index({ fromUser: 1, toUser: 1 });

module.exports = mongoose.model('Connection', connectionSchema);