const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chat");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://ride-sharing-1.onrender.com",
    credentials: true,
  },
});
const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB is connected");
  } catch (error) {
    console.error("Failed to connect", error.message);
  }
};

main()
app.use(cors({
  origin: "https://ride-sharing-1.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use("/auth", require("./routes/authroute"));
app.use("/ride", require("./routes/rideRoutes"));
app.use("/vehicle", require("./routes/vehicleRegisterRoute"));
app.use("/profile", require("./routes/myProfileRoute"));
app.use("/chat", require("./routes/chatRoute"));


app.get("/", (req, res) => {
  res.send("BlablaCar Home Page");
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("chatMessage", async (msg) => {
    try{
      const chat = await Chat({
        sender: msg.sender,
        receiver: msg.recipient,
        message: msg.message,
      });
      await chat.save();
       io.to(msg.recipient).emit("message", { message: msg.message, sender: msg.sender });
    }
    catch(err){
      console.error('Error saving message:', err);
    }
   
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});


const PORT = process.env.PORT;
server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);

module.exports = io;