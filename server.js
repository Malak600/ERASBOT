const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

// File storage setup using Multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid duplicates
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Make sure 'public' contains the frontend files

// 🚀 **File upload endpoint**
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: (req.file.size / 1024).toFixed(2) + " KB"
  });
});

// 🌐 **Socket.io setup**
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Bot responses for different questions
  const botResponses = {
    "courses": `Here are the available courses with their ECTS points:\n\n
    1st Semester:\n
    - Academic English for Computer Engineering I (6 ECTS)\n
    - Programming Fundamentals (6 ECTS)\n
    - Foundations of Computing Systems (6 ECTS)\n
    - Physics I (6 ECTS)\n
    - Calculus I (6 ECTS)\n
    - Atatürk's Principles and History of Turkish Revolution I (3 ECTS)\n
    - Career Planning (3 ECTS)\n
    - Turkish I (3 ECTS)\n\n

    2nd Semester:\n
    - Academic English for Computer Engineering II (6 ECTS)\n
    - Intermediate Programming (6 ECTS)\n
    - Chemistry (6 ECTS)\n
    - Physics II (6 ECTS)\n
    - Calculus II (6 ECTS)\n
    - Atatürk's Principles and History of Turkish Revolution II (3 ECTS)\n
    - Turkish II (3 ECTS)\n\n

    // Additional semesters...

    `,

  "how many ECTS for all courses": `The total ECTS for all the available courses is:

    1st Semester:\n
    6 + 6 + 6 + 6 + 6 + 3 + 3 + 3 = 39 ECTS\n
    
    2nd Semester:\n
    6 + 6 + 6 + 6 + 6 + 3 + 3 = 36 ECTS\n
    
    // Repeat for other semesters

    Total ECTS for all semesters combined: 180 ECTS (assuming these are all the courses).`,
    "hello": "Hello! How can I assist you today? 😊",
    "how are you": "I'm just a bot, but I'm doing great! How about you?",
    "what is your name": "I'm ERASBOT, your Erasmus assistant! 🤖", // Updated bot name
    "what can you do": "I can help you choose courses, explore the city, and answer general questions! 🎓🌍",
    "help": "Sure! You can ask about:\n- Courses 📚\n- City Guide 🌍\n- Weather ☀️\n- Erasmus Rules 📜",
    "bye": "Goodbye! Have a great day! 👋",
    // Additional questions
    "what are the available courses": "You can explore available courses in various fields including Computer Science, Business, and more! 🎓",
    "do you have any courses on programming": "Yes, we have courses in programming, including Python, JavaScript, and more! 💻",
    "how can I choose the right course": "I can assist you in selecting the best courses based on your interests and academic goals! 🎯",
    "what's the weather like in [city name] today": "I can check the weather for you in real-time, just let me know the city! 🌤️",
    "what are the top tourist attractions in [city name]": "I can provide a list of must-see places, just tell me the city! 🏞️",
    "where can I eat good food in [city name]": "I can help you find the best restaurants and food spots in your city! 🍕🍔",
    "what can I do over the weekend": "You can explore local museums, go hiking, or enjoy the nightlife! 🌟",
    "how do I adjust to student life": "Start by getting involved in campus activities and joining clubs. It’s a great way to meet people! 🎉",
    "are there any events at the university": "Yes, the university regularly hosts events like cultural nights, sports activities, and academic talks. 📅",
    "where can I find help for new students": "You can contact the student support center or join the student orientation program. 🤝",
    "can you tell me a joke": "Why don’t skeletons fight each other? They don’t have the guts! 😄",
    // Add more questions and responses
    "how do I apply for a course": `Here are the matched courses between partner universities and İstanbul Kültür Üniversitesi with their ECTS credits:\n\n
🟩 Nysa University of Applied Sciences ↔ İstanbul Kültür Üniversitesi:\n
- Operating Systems ↔ CSE5031 Operating Systems\n
- The Basics of Computer Networks ↔ CSE6032 Computer Networks\n
- The Basics of Databases ↔ CSE5041 Database Design and Development\n
- Fundamentals of Artificial Intelligence ↔ CSE0440 Artificial Intelligence\n
- E-business ↔ CSE0499 Special Topics in Computer Engineering\n
- Information Data Management ↔ CSE0457 Web Mining\n\n

🟩 Lodz University of Technology ↔ İstanbul Kültür Üniversitesi:\n
- English in Action (4 ECTS) ↔ YDI0003 English III (3 ECTS)\n
- Algorithms and Data Structures (5 ECTS) ↔ CSE4014 Data Structures and Algorithms I (8 ECTS)\n
- Polish Language A0-A1 (3 ECTS) ↔ YDR0001 Russian I (3 ECTS)\n
- Computer Networks (4 ECTS) ↔ CSE5001 Computer Networks (7 ECTS)\n
- Computer Architecture (5 ECTS) ↔ CSE0427 Computer Architecture (6 ECTS)\n
- Embedded Systems (5 ECTS) ↔ CSE0420 Embedded Systems (6 ECTS)\n
- Human Computer Interaction (5 ECTS) ↔ CSE0403 Graphical User Interface Design and Development (6 ECTS)\n\n

Total ECTS (Lodz): 31 ECTS  
Total ECTS (İstanbul Kültür Üniversitesi): 39 ECTS
`,
    // New response to handle "courses" query
    "courses": "Here are the available courses:\n\n1st Semester:\n- Academic English for Computer Engineering I\n- Programming Fundamentals\n- Foundations of Computing Systems\n- Physics I\n- Calculus I\n- Atatürk's Principles and History of Turkish Revolution I\n- Career Planning\n- Turkish I\n\n2nd Semester:\n- Academic English for Computer Engineering II\n- Intermediate Programming\n- Chemistry\n- Physics II\n- Calculus II\n- Atatürk's Principles and History of Turkish Revolution II\n- Turkish II\n\n3rd Semester:\n- Digital Design\n- Discrete Structures\n- Academic Writing and Presentation Skills\n- Object Oriented Programming\n- Linear Algebra\n- Elective\n\n4th Semester:\n- System Analysis and Design\n- Microprocessors\n- Data Structures and Algorithms\n- Computer Organization\n- Signals and Systems\n- Elective\n\n5th Semester:\n- Introduction to Probability Theory and Statistics\n- Web Programming\n- Operating Systems\n- Database Management Systems\n- Internship I\n- Departmental Elective\n\n6th Semester:\n- Computer Networks\n- Software Engineering\n- Numerical Methods\n- Departmental Elective\n\n7th Semester:\n- Internship II\n- Strategy, Ethics, and Entrepreneurship\n- Economics for Engineers\n- Departmental Elective\n\n8th Semester:\n- Capstone Project\n- Departmental Elective\n"
  };

  // Receive user message and send a response
  socket.on("chatMessage", (msg) => {
    console.log(`📩 User: ${msg}`);

 const cleanedMsg = msg.trim().toLowerCase(); // Normalize input

    // Logic for intelligent response (Improving bot interaction)
    let botResponse;
    if (botResponses[msg.toLowerCase()]) {
      botResponse = botResponses[msg.toLowerCase()];
    } else {
      botResponse = `Sorry, I didn't quite understand that. 🤖 Try rephrasing or ask "help" to see what I can do.`; // Default response for unknown questions
    }

    setTimeout(() => {
      socket.emit("botReply", botResponse);
    }, 500); // Short delay to simulate AI response
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
