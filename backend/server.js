require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const initScheduler = require('./utils/scheduler');

connectDB();

// Init Scheduler
initScheduler();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set('io', io);

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });

    // Simpler approach for this project structure:
    // Join a room based on USER ID.
    // When sending a message to User X, emit to room "User X ID".
    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User/Trainer ${userId} joined room: ${userId}`);
    });
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tracker', require('./routes/trackerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin/content', require('./routes/adminContentRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/social', require('./routes/socialRoutes'));
app.use('/api/trainer', require('./routes/trainerRoutes'));
app.use('/api/trainer', require('./routes/trainerRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/wearables', require('./routes/wearableRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Fitness Tracker API is running');
});

app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
