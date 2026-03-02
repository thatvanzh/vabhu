const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Allow the app to load your CSS, JS, Images, and Sound files
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('newuser', (username) => {
        socket.broadcast.emit('update', username + " joined the chat");
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('update', "A user left the chat");
    });
    socket.on('chat', (message) => {
        socket.broadcast.emit('chat', message);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Vabhu Server running on port ${port}`);
});
