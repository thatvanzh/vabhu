const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

// Serve frontend files
app.use(express.static(__dirname));

io.on("connection", socket => {

    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
