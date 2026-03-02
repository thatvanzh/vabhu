const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.io Logic (The Chat Brain)
io.on('connection', (socket) => {
    
    // When a new user joins
    socket.on('newuser', (username) => {
        socket.broadcast.emit('update', username + " has joined the conversation");
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('update', "A user has left the conversation");
    });

    // When a user sends a message
    socket.on('chat', (message) => {
        socket.broadcast.emit('chat', message);
    });
});

// Listen on the port Render assigns (or 3000 locally)
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
