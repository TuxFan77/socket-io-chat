const PORT = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/formatMessage");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chatBot = "RocketChat Bot";

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  // Send message to the client that just connected
  socket.emit("message", formatMessage(chatBot, "Welcome to RocketChat!"));

  // Broadcast to all clients except the one that just connected
  socket.broadcast.emit(
    "message",
    formatMessage(chatBot, `Client ${socket.id} has connected to the chat.`)
  );

  // When client disconnects, send a message to all clients.
  // Since the socket object has disconnected we have to use io.emit.
  // This broadcasts a message to every socket connection.
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected.`);
    io.emit(
      "message",
      formatMessage(chatBot, `Client ${socket.id} has left the chat.`)
    );
  });

  // Handle incoming chat message. Send it out to all clients.
  socket.on("chat", message => {
    io.emit("message", formatMessage("USER", message));
  });
});
