require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tracker', require('./routes/trackerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/content', require('./routes/adminContentRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/social', require('./routes/socialRoutes'));
app.use('/api/trainer', require('./routes/trainerRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Fitness Tracker API is running');
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
