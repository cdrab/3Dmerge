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
  await db.sequelize.query(`INSERT INTO pages (ID_page, page, icon, position, minYAngle, maxYAngle, minXAngle, createdAt, updatedAt, home, maxXAngle) VALUES
  (5, 'Fenêtres', './img/icon/iconizer-la-fenetre.svg', '1.2,0.9,0.2', 0.2, 0.7, -0.07, '2023-09-29 13:14:05', '2023-10-13 16:56:46', './img/home/_MG_7819-1.jpg', 0.47),
  (6, 'Portes', './img/icon/iconizer-ouverture-de-porte-ouverte.svg', '0,-0.2,0.965', 0.2, 1.12, -0.38, '2023-10-04 10:51:51', '2023-10-13 17:07:56', './img/home/bann_porte_result.webp', 0.47),
  (7, 'Habillages', './img/icon/iconizer-batiment-de-4-magasins.svg', '0.1,1.55,1.4', 0.2, 0.9, -0.8, '2023-10-04 11:00:33', '2023-10-13 16:59:25', './img/home/_MG_4038.png', 0.5),
  (8, 'Aménagement Intérieur', './img/icon/iconizer-plan-de-la-maison.svg', '0,-0.75,2.6', 1, 1.15, -0.29, '2023-10-11 15:59:47', '2023-10-13 17:02:00', './img/home/bann_AME-INT_result.webp', 0.43),
  (9, 'Aménagement Extérieur', './img/icon/icon.png', '1.38,0.26,0.9', 1, 0.78, -0.27, '2023-10-11 16:04:49', '2023-10-13 17:03:36', './img/home/bann_AME-EXT_result.webp', 0.79),
  (10, 'Baies', './img/icon/iconizer-porte-coulissante.svg', '1.32,-0.18,0.22', 1, 1.3, -0.17, '2023-10-11 16:05:31', '2023-10-13 17:04:53', './img/home/bann_baie_result.webp', 0.7),
  (11, 'Garde corps', './img/icon/iconizer-escaliers_1.svg', '0.03,0.65,1.65', 1, 0.95, -0.4, '2023-10-11 16:06:12', '2023-10-13 17:05:51', './img/home/bann_gard_result.webp', 0.55),
  (12, 'Ferméture Extérieur', './img/icon/iconizer-garage.svg', '-1.3,-0.01,0.23', 1, 1.02, -0.6, '2023-10-11 16:06:49', '2023-10-13 17:09:24', './img/home/bann-FER-EXT_result.webp', 0.1);
  `)
  server.listen(process.env.PORT, "0.0.0.0",() => {
    console.log(`http://127.0.0.1:${process.env.PORT}`);
  });
});

app.use(express.static("./public/dist/"));

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
