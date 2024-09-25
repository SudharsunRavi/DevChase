const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv=require('dotenv').config();

const connectToDB = require('./DBconfig');

const authRoutes=require('./routes/auth.route');
const profileRoutes=require('./routes/profile.route');
const connectionRoutes=require('./routes/connection.route');

const app=express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request', connectionRoutes);

connectToDB().then(() => {
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
}).catch((err) => {
    console.log(err);
});
