const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const verifiedUser = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) throw new Error("Unauthorized");

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user) throw new Error("Unauthorized");

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ status:false, message: 'Unauthorized' });
    }
};

module.exports = verifiedUser;