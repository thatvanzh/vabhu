const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});
const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    
    socket.on('newuser', (username) => {
        socket.broadcast.emit('update', username + " joined the conversation");
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('update', "A user left the conversation");
    });

    socket.on('chat', (message) => {
        // Broadcast sends to everyone EXCEPT sender
        socket.broadcast.emit('chat', message);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
