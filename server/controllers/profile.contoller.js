const bcrypt = require('bcrypt');

const view = async (req, res) => {
    try {
        const user=req.user;
        res.status(200).json({ status: true, user });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const update=async (req, res) => {
    try {
        const {name, email, gender, age, profileurl, skills, about} = req.body;
        const user=req.user;

        Object.keys(req.body).forEach(key=>{
            user[key]=req.body[key];
        });

        const data=await user.save();
        res.status(200).json({ status: true, message: 'Profile updated successfully!', data});
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const updatePassword=async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const user=req.user;
        
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordCorrect) throw new Error("Invalid credentials");

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password=hashedPassword;

        await user.save();
        res.status(200).json({ status: true, message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

module.exports = { view, update, updatePassword };