const mongoose=require('mongoose');

const connectToDB = async() => {
    await mongoose.connect('mongodb+srv://sudharsunr2004:susan@devchasecluster.3qxpy.mongodb.net/')
}

module.exports = connectToDB;