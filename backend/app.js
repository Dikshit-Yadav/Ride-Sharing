const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
  origin: "http://localhost:5173",
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



app.get("/", (req, res) => {
  res.send("BlablaCar Home Page");
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
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