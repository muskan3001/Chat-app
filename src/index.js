const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
let count = 0;
io.on("connection", (socket) => {
  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");
  socket.on("sendMessage", (input) => {
    io.emit("message", input);
  });
  socket.on("disconnect", () => {
    io.emit("message", "A USER HAS LEFT");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
