const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const {username, email, gender, age, skills, about, profileurl, password} = req.body;
        
        if(await User.findOne({username})) throw new Error("Username already exists");
        if(await User.findOne({email})) throw new Error("Email already exists");

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser=new User(
            {
                username,
                email,
                gender,
                age,
                skills,
                about,
                profileurl,
                password: hashedPassword
            }
        );

        await newUser.save();
        res.status(201).json({ status: true, message: "Signed up successfully!"});
    } catch (error) {
        res.status(500).json({ status: false, message: error.message});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) throw new Error("Invalid credentials");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) throw new Error("Invalid credentials");

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.cookie("token", token);

        res.status(200).json({ status: true, message: "Logged in successfully!" });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message});
    }
}

const logout = async (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.status(200).json({ status: true, message: "Logged in successfully!" });
};

module.exports = { signup, login, logout };