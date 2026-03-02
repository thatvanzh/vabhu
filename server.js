const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// CRITICAL: This allows the browser to load style.css, client.js, and images
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    
    // 1. When a user joins
    socket.on('newuser', (username) => {
        // Send to everyone ELSE
        socket.broadcast.emit('update', username + " joined the conversation");
    });

    // 2. When a user disconnects
    socket.on('disconnect', () => {
        // Send to everyone ELSE
        socket.broadcast.emit('update', "A user left the conversation");
    });

    // 3. When a user sends a chat message
    socket.on('chat', (message) => {
        // Send to everyone ELSE
        socket.broadcast.emit('chat', message);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Vabhu Server running on port ${port}`);
});
