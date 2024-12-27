const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); // Ensure dotenv is loaded at the top

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('updateTask', (task) => {
    io.emit('taskUpdated', task);
  });

  socket.on('addTask', (task) => {
    io.emit('taskAdded', task);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB using the environment variable for Mongo URI
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }) // Use MONGO_URL from .env
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server using the environment variable for PORT
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));
