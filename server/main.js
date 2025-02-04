const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv=require('dotenv').config();
const cors=require('cors');
const http=require('http');

const connectToDB = require('./DBconfig');

const authRoutes=require('./routes/auth.route');
const profileRoutes=require('./routes/profile.route');
const connectionRoutes=require('./routes/connection.route');
const userRoutes=require('./routes/user.route');
const paymentRoutes = require('./routes/payment.route');
const chatRoutes = require('./routes/chat.route');

const configureSocket = require('./Socket');
const app=express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/request', connectionRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/chat', chatRoutes);

const server=http.createServer(app);
configureSocket(server);

connectToDB().then(() => {
    server.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}).catch((err) => {
    console.log(err);
});
