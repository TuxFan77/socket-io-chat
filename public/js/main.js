const socket = io();

const chatForm = document.getElementById("chat-form");

// Handles chat message submission
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const { msg } = e.target.elements;
  socket.emit("chat", msg.value);
  msg.value = "";
  msg.focus();
});

// Handle chat messages coming from the server
socket.on("message", message =>
  console.log(`Chat message received: ${message}`)
);
