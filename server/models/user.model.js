const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: '{VALUE} is not supported',
        }
    },
    age: {
        type: Number,
        min: 18
    },
    skills: {
        type: [String],
    },
    about: {
        type: String,
        maxlength: 500,
    },
    profileurl: {
        type: String,
        default: 'https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png',
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    premium: {
        type: String,
        required: true,
        default: 'false',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);