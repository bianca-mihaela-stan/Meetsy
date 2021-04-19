const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
app.use(require('cors')())

console.log("server")
const users = {};

io.on('connection', socket => {
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    console.log("yourID");
    io.sockets.emit("allUsers", users);
    console.log("allUsers")
    socket.on('disconnect', () => {
        console.log("disconnect")
        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});

server.listen(3001, () => console.log('server is running on port 3001'));