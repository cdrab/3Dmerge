const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./database/models");
const { users, products, pages, sessions } = require("./database/models");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path")

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.123.210:5173", "http://192.168.137.1:5173", "https://verdant-souffle-330245.netlify.app/"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    socket.join(data.room);
  });

  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("receiveMessage", data);
  });

  socket.on("sendAvatar", (data) => {
    socket.to(data.receiver).to(data.sender).emit("receiveAvatar", data);
  });

  socket.on("connectUser", (data) => {
    socket.to(data.room).emit("receiveConnectUser", data);
  });

  socket.on("logoutUser", (data) => {
    socket.to(data.room).emit("receiveLogoutUser", data);
  });

  socket.on("UserInterested", (data) => {
    socket.to(data.room).emit("receiveInterested", data);
  });

  socket.on("formAdd", (data) => {
    socket.broadcast.emit("receiveForm", data);
  });

  socket.on("deleteForm", (data) => {
    socket.broadcast.emit("receiveDelete", data);
  });
});


products.belongsTo(pages, { onDelete: "CASCADE", foreignKey: "pageId" });
users.hasOne(sessions, { foreignKey: "userId" });
sessions.belongsTo(users, { foreignKey: "userId" });

db.sequelize.sync().then(async() => {
  // await db.sequelize.query(`SET PERSIST sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)
  server.listen(process.env.PORT, "0.0.0.0",() => {
    console.log(`http://127.0.0.1:${process.env.PORT}`);
  });
});

app.use(express.static("public/dist/"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: [`http://localhost:5173`, "http://192.168.123.210:5173", "http://192.168.137.1:5173", "https://verdant-souffle-330245.netlify.app/"],
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

const refreshRoutes = require("./routes/Refresh.js");
app.use("/refresh", refreshRoutes);

const userRoutes = require("./routes/Users.js");
app.use("/auth", userRoutes);

const trakerRoutes = require("./routes/Trakers.js");
app.use("/traker", trakerRoutes);

const pageRoutes = require("./routes/Pages.js");
app.use("/page", pageRoutes);

const productRoutes = require("./routes/Products.js");
app.use("/product", productRoutes);

const logRoutes = require("./routes/Logs.js");
app.use("/log", logRoutes);

const messageRoutes = require("./routes/Messages.js");
app.use("/message", messageRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
