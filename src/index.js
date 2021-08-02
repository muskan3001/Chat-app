const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const app = express();
const server = http.createServer(app);
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const io = socketio(server);
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
let count = 0;
io.on("connection", (socket) => {
  socket.emit("message", generateMessage("Welcome!"));
  socket.broadcast.emit("message", generateMessage("A new user has joined"));
  socket.on("sendMessage", (input, callback) => {
    const filter = new Filter();
    if (filter.isProfane(input)) {
      return callback("Profanity is not allowed");
    }
    io.emit("message", generateMessage(input));
    callback();
  });
  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left"));
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
