const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    
    // 1. Join Event
    socket.on('newuser', (username) => {
        console.log(username + " connected"); // See this in terminal?
        socket.broadcast.emit('update', username + " has joined the chat");
    });

    // 2. Disconnect Event
    socket.on('disconnect', () => {
        console.log("A user disconnected"); // See this in terminal?
        socket.broadcast.emit('update', "A user has left the chat");
    });

    // 3. Chat Message Event
    socket.on('chat', (message) => {
        console.log("Message received: " + message.text); // See this in terminal?
        socket.broadcast.emit('chat', message);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Vabhu Server running on port ${port}`);
});
