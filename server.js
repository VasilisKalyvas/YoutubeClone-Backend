import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

const app = express()
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {
        console.log('Connected to Database!');
    }).catch(err => {
        throw err
    });
}
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin: true,
      methods: ["GET", "POST","PUT", "DELETE"],
      credentials: true,
    })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req,res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!'
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

const server = app.listen(process.env.PORT, () => {
    connect()
    console.log('Connected to Server');
})

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId});
    return users;
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
return users;
};

const removeUserByLogout = (userId) => {
    users = users.filter((user) => user.userId !== userId);
return users;
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)  
};

let users = [];
var count = 0;
const io = new Server(server, {
    cors: {
      origin: 'https://classy-cendol-b9dde5.netlify.app/',
    },
  });

io.on("connection", (socket) => {
    //console.log(`Connected to socket.io ${socket.id}`);

    //take userId and socketId from user
    socket.on('addUser', userId =>{
        addUser(userId, socket.id);
        io.emit('getUsers', users);
        count = users.length;
        io.emit("Count Online", count);
      });

    socket.on('NewNotification', (channelid,  currentUserId, username, videoId, type)  =>{
        const user = getUser(channelid);
        const data = `${currentUserId} just subscribed to your channel`;
        console.log(user);
        if(user){     
            if(channelid !== currentUserId){
                io.to(user.socketId).emit("GetNotification", {name: username, videoId: videoId, type: type });
            }
        }
      });

      socket.on('NewVideo', (username, videoId, subscribers, type)  =>{
        console.log(type);
        for(let i=0; i<subscribers.length; i++){
            const user = getUser(subscribers[i]);
            console.log(user);
            if(user){     
                io.to(user.socketId).emit("GetNotification", {name: username, videoId: videoId, type: type});
            }
        }
      }); 

      socket.on('disconnect',() =>{
        console.log('A user disconnected');
        removeUser(socket.id)
        io.emit('getUsers', users);
        count = users.length;
        io.emit("Count Online", count);
      });

      socket.on('logout', (userId) => {
        removeUserByLogout(userId)
        io.emit('getUsers', users);
        count = users.length;
        io.emit("Count Online", count);
      }) 
});