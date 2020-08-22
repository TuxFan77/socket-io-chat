const PORT = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  console.log("Client connected. Socket ID:", socket.id);

  io.emit("message", "Welcome to ChitChat.");
});
