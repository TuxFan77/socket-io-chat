const PORT = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/formatMessage");
const {
  userJoin,
  userLeave,
  getCurrentUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chatBot = "RocketChat Bot";

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

io.on("connection", socket => {
  // Handle a user joining a room
  socket.on("joinRoom", ({ username, room }) => {
    // Add a new user to the list of users
    const user = userJoin(socket.id, username, room);

    // Join the user to the room
    socket.join(user.room);

    sendUsersInRoom(user.room);

    // Send message to the user that just connected
    socket.emit("message", formatMessage(chatBot, "Welcome to RocketChat!"));

    // Update the front end with the current list of users in the room

    // Broadcast to all users except the one that just connected
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(chatBot, `${user.username} has connected to the chat.`)
      );
  });

  // Handle incoming chat message. Send it out to all users in the same room
  socket.on("chat", message => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  // When user disconnects, send a message to all users in the room
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (!user) return;
    sendUsersInRoom(user.room);
    io.to(user.room).emit(
      "message",
      formatMessage(chatBot, `${user.username} has left the chat.`)
    );
  });

  // Given a room, send a list of users in that room
  function sendUsersInRoom(room) {
    io.to(room).emit("usersInRoom", {
      room,
      users: getUsersInRoom(room),
    });
  }
});
