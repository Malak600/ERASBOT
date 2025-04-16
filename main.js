document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JavaScript Loaded Successfully!");

  const socket = io("http://localhost:3000"); // ✅ Socket initialization

  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const voiceBtn = document.getElementById("voice-btn");
  const attachmentBtn = document.getElementById("attachment-btn");
  const fileUpload = document.getElementById("file-upload");
  const thinkingMessage = document.getElementById("thinking-message");

  if (!sendBtn || !voiceBtn || !attachmentBtn || !fileUpload || !chatBox || !userInput) {
    console.error("❌ One or more elements not found!");
    return;
  }

  // Function to show thinking message
  function showThinking() {
    console.log("🤖 Showing thinking message...");
    thinkingMessage.style.display = "block";
  }

  // Function to hide thinking message
  function hideThinking() {
    console.log("✅ Hiding thinking message...");
    thinkingMessage.style.display = "none";
  }

  // Function to append messages to chat box
  function appendMessage(content, sender) {
    const message = document.createElement("div");
    message.classList.add(`${sender}-message`);
    message.textContent = content;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Function to send messages
  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    showThinking();

    socket.emit("chatMessage", message);
    userInput.value = "";
  }

  sendBtn.addEventListener("click", () => {
    console.log("📩 Send Button Clicked!");
    sendMessage();
  });

  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      console.log("⌨️ Enter Key Pressed!");
      sendMessage();
    }
  });

  socket.on("botReply", (msg) => {
    console.log("🤖 Bot reply received:", msg);
    hideThinking();
    appendMessage(msg, "bot");
  });

  // 🎤 Voice Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    voiceBtn.addEventListener("click", () => {
      console.log("🎤 Voice Button Clicked!");
      recognition.start();
      appendMessage("🎤 Listening...", "bot");
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Recognized Speech:", transcript);
      appendMessage(transcript, "user");
      showThinking();
      socket.emit("chatMessage", transcript);
    };
  } else {
    console.warn("❌ Speech Recognition Not Supported");
    voiceBtn.style.display = 'none';
  }

  // 📎 File Upload
  attachmentBtn.addEventListener("click", () => {
    console.log("📎 Attachment Button Clicked!");
    fileUpload.click();
  });

  fileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`📁 File Selected: ${file.name}`);
      appendMessage(`📁 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, "user");
    }
  });
});
