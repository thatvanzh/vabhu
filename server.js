const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" } // Allow all connections
});
const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    socket.on('newuser', (username) => {
        socket.broadcast.emit('update', username + " joined");
    });

    socket.on('chat', (message) => {
        socket.broadcast.emit('chat', message);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('update', "User left");
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
