require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Routes = require("./Routes/router");
const chatRoutes = require("./Routes/ChatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(Routes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
// Create an HTTP server using Express
const server = http.createServer(app);

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

app.use(express.json());

app.post("/getResponse", async (req, res) => {
  const { destination, date, length, group, budget, activity, promptG } =
    req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = promptG;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Get the text response

    // Send the response back to the client
    res.json({ response: text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Socket.IO setup
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.IO event handlers
io.on("connection", (socket) => {
  // Handle connection
  socket.on("setUp", (userData) => {
    socket.join(userData);
    socket.emit("connected");
    console.log(`user with Id: ${socket.id} joined room: ${userData}`);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined room:" + room);
  });
  socket.on("new Message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat user not found");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
    console.log(newMessageRecieved);
    // socket.to(data.room).emit("receiveMessage", data);
  });

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Start listening on the combined server
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT} and connected to database`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
