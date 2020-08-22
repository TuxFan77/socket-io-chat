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
socket.on("message", message => {
  console.log(`Chat message received: ${message}`);
  outputMessage(message);
});

// Outputs a chat message to the DOM
function outputMessage(message) {
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message");
  messageWrapper.innerHTML = `
    <p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">${message}</p>
  `;
  document.querySelector(".chat-messages").appendChild(messageWrapper);
  messageWrapper.scrollIntoView({ behavior: "smooth" });
}
