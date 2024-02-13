const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage'); 
const config = require('./config');
const cors = require('cors'); // Import the CORS middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// Use the CORS middleware
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Socket.io logic
io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);

        // Retrieve messages for the room from MongoDB and emit to the user.
        GroupMessage.find({ room: room })
            .then(messages => {
                socket.emit('loadGroupMessages', messages);
            })
            .catch(error => {
                console.error('Error retrieving group messages:', error);
            });

        PrivateMessage.find({ room: room })
            .then(messages => {
                socket.emit('loadPrivateMessages', messages);
            })
            .catch(error => {
                console.error('Error retrieving private messages:', error);
            });
    });

    // Handle sending group messages
    socket.on('sendGroupMessage', (message) => {
        // Save the message to MongoDB
        const newGroupMessage = new GroupMessage({
            sender: message.sender,
            room: message.room,
            content: message.content,
            timestamp: new Date()
        });
        newGroupMessage.save()
            .then(() => {
                // Broadcast the message to everyone in the room
                io.to(message.room).emit('receiveGroupMessage', newGroupMessage);
            })
            .catch(error => {
                console.error('Error saving group message to MongoDB:', error);
            });
    });

    // Handle sending private messages
    socket.on('sendPrivateMessage', (message) => {
        // Save the message to MongoDB
        const newPrivateMessage = new PrivateMessage({
            sender: message.sender,
            receiver: message.receiver,
            room: message.room,
            content: message.content,
            timestamp: new Date()
        });
        newPrivateMessage.save()
            .then(() => {
                // Emit the message to the receiver
                io.to(message.receiver).emit('receivePrivateMessage', newPrivateMessage);
            })
            .catch(error => {
                console.error('Error saving private message to MongoDB:', error);
            });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
