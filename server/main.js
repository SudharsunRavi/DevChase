const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv=require('dotenv').config();
const cors=require('cors');

const connectToDB = require('./DBconfig');

const authRoutes=require('./routes/auth.route');
const profileRoutes=require('./routes/profile.route');
const connectionRoutes=require('./routes/connection.route');
const userRoutes=require('./routes/user.route');

const app=express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request', connectionRoutes);
app.use('/api/user', userRoutes);

connectToDB().then(() => {
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
}).catch((err) => {
    console.log(err);
});
