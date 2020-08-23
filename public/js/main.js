const socket = io();

const roomName = document.getElementById("room-name");
const chatForm = document.getElementById("chat-form");

// Parse the username and room from the query string
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chat room
socket.emit("joinRoom", { username, room });

// Handles chat message submission
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const { msg } = e.target.elements;
  socket.emit("chat", msg.value);
  msg.value = "";
  msg.focus();
});

// Handle user list from server
socket.on("usersInRoom", userList => {
  updateRoomName(userList.room);
});

// Handle chat messages coming from the server
socket.on("message", message => {
  outputMessage(message);
});

// Outputs a chat message to the DOM
function outputMessage({ username, message, time }) {
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message");
  messageWrapper.innerHTML = `
    <p class="meta">${username} <span>${time}</span></p>
    <p class="text">${message}</p>
  `;
  document.querySelector(".chat-messages").appendChild(messageWrapper);
  messageWrapper.scrollIntoView({ behavior: "smooth" });
}

// Updates the room name in the DOM
function updateRoomName(room) {
  roomName.textContent = room;
}
