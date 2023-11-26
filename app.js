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

db.sequelize.sync({force:true}).then(async() => {
  await db.sequelize.query(`INSERT INTO pages (ID_page, page, icon, position, minYAngle, maxYAngle, minXAngle, createdAt, updatedAt, home, maxXAngle) VALUES
  (5, 'Fenêtres', '/img/icon/iconizer-la-fenetre.svg', '1.2,0.9,0.2', 0.2, 0.7, -0.07, '2023-09-29 13:14:05', '2023-10-13 16:56:46', '/img/home/_MG_7819-1.jpg', 0.47),
  (6, 'Portes', '/img/icon/iconizer-ouverture-de-porte-ouverte.svg', '0,-0.2,0.965', 0.2, 1.12, -0.38, '2023-10-04 10:51:51', '2023-10-13 17:07:56', '/img/home/bann_porte_result.webp', 0.47),
  (7, 'Habillages', '/img/icon/iconizer-batiment-de-4-magasins.svg', '0.1,1.55,1.4', 0.2, 0.9, -0.8, '2023-10-04 11:00:33', '2023-10-13 16:59:25', '/img/home/_MG_4038.png', 0.5),
  (8, 'Aménagement Intérieur', '/img/icon/iconizer-plan-de-la-maison.svg', '0,-0.75,2.6', 1, 1.15, -0.29, '2023-10-11 15:59:47', '2023-10-13 17:02:00', '/img/home/bann_AME-INT_result.webp', 0.43),
  (9, 'Aménagement Extérieur', '/img/icon/icon.png', '1.38,0.26,0.9', 1, 0.78, -0.27, '2023-10-11 16:04:49', '2023-10-13 17:03:36', '/img/home/bann_AME-EXT_result.webp', 0.79),
  (10, 'Baies', '/img/icon/iconizer-porte-coulissante.svg', '1.32,-0.18,0.22', 1, 1.3, -0.17, '2023-10-11 16:05:31', '2023-10-13 17:04:53', '/img/home/bann_baie_result.webp', 0.7),
  (11, 'Garde corps', '/img/icon/iconizer-escaliers_1.svg', '0.03,0.65,1.65', 1, 0.95, -0.4, '2023-10-11 16:06:12', '2023-10-13 17:05:51', '/img/home/bann_gard_result.webp', 0.55),
  (12, 'Ferméture Extérieur', '/img/icon/iconizer-garage.svg', '-1.3,-0.01,0.23', 1, 1.02, -0.6, '2023-10-11 16:06:49', '2023-10-13 17:09:24', '/img/home/bann-FER-EXT_result.webp', 0.1);
  `)
  await db.sequelize.query(`INSERT INTO products (ID_product, title, description, png, createdAt, updatedAt, pub, pageId, gallery) VALUES
  (2, 'Fenêtre Coulissante', 'une fenetre coullissante fait avec almunium', '/img/png/FENÊTRE COULISSANTE.png', '2023-10-04 07:30:40', '2023-10-04 10:13:44', '/img/pub/_MG_3898-1.jpg', 5, '/img/gallery/_MG_4788.JPG,/img/gallery/_MG_4805-1.jpg,/img/gallery/_MG_7673.jpg,/img/gallery/_MG_7927-1.jpg'),
  (4, 'Fenêtre Battante', 'une fenetre coullissante fait avec almunium', '/img/png/FENÊTRE BATTANTE.png', '2023-10-04 07:48:11', '2023-10-04 10:15:34', '/img/pub/_MG_3801-1.jpg', 5, '/img/gallery/_MG_2553.JPG,/img/gallery/_MG_3898-1.jpg,/img/gallery/_MG_7827.jpg'),
  (5, 'Fenêtre Projetant', 'une fenetre coullissante fait avec almunium', '/img/png/PROJETANT.png', '2023-10-04 07:57:01', '2023-10-04 10:27:31', '/img/pub/P1030588-1.jpg', 5, '/img/gallery/_MG_1799.JPG,/img/gallery/_MG_1803.JPG,/img/gallery/_MG_6986-1.jpg'),
  (12, 'Fenêtre Jalousie', 'une fenetre coullissante fait avec almunium', '/img/png/JALOUSIE.png', '2023-10-04 09:31:25', '2023-10-04 09:39:28', '/img/pub/00000130.JPG', 5, '/img/gallery/00000130.JPG,/img/gallery/IMG_20220823_104402-1.jpg,/img/gallery/IMG_20220823_104402-2.jpg,/img/gallery/IMG_20220823_104402-3.jpg,/img/gallery/IMG_2690-1.jpg,/img/gallery/_MG_6448.JPG,/img/gallery/_MG_7819-1.jpg'),
  (13, 'Fenêtre Souflet', 'une fenetre coullissante fait avec almunium', '/img/png/SOUFFLET.png', '2023-10-04 10:28:45', '2023-10-04 10:28:45', '/img/pub/_MG_7691-1.jpg', 5, '/img/gallery/_DSC9027.JPG,/img/gallery/_MG_3994-1.jpg,/img/gallery/_MG_7691-1.jpg'),
  (14, 'Fenêtre Oscillo-Battente', 'une fenetre coullissante fait avec almunium', '/img/png/FENÊTRE OSCILLO-BATTANTE.png', '2023-10-04 10:43:16', '2023-10-04 10:43:16', '/img/pub/_MG_3801-1.jpg', 5, '/img/gallery/P1030588-1.jpg,/img/gallery/_MG_2897-1.jpg,/img/gallery/_MG_3801-1.jpg,/img/gallery/_MG_3883.jpg'),
  (17, 'Porte Automatique', 'Porte Automatique', '/img/png/PORTE AUTOMATIQUE_result.webp', '2023-10-11 16:32:21', '2023-10-11 16:32:21', '/img/pub/chevron-gauche.png', 6, '/img/gallery/_DSC4331_result.webp,/img/gallery/_MG_9951-1_result.webp'),
  (18, 'Porte Coulissante', 'Porte Coulissante', '/img/png/PORTE COULLISSANTE_result.webp', '2023-10-11 16:34:53', '2023-10-11 16:34:53', '/img/pub/chevron-droit.png', 6, '/img/gallery/_MG_4798_result.webp,/img/gallery/_MG_9333_result.webp,/img/gallery/_MG_9952_result.webp'),
  (19, 'Porte Battante', 'Porte Battante', '/img/png/PORTE DENTREE_result.webp', '2023-10-11 16:36:07', '2023-10-11 16:36:07', '/img/pub/chevron-droit.png', 6, '/img/gallery/00000035_result.webp,/img/gallery/3_result.webp,/img/gallery/_MG_5780_result.webp,/img/gallery/_MG_6502-1_result.webp,/img/gallery/_MG_7644-1_result.webp,/img/gallery/_MG_8014_result.webp,/img/gallery/_MG_9943_result.webp'),
  (20, 'Panneau Composite', 'Panneau Composite', '/img/png/LYZA_result.webp', '2023-10-11 16:53:06', '2023-10-11 16:53:06', '/img/pub/chevron-droit.png', 7, '/img/gallery/AKOOR  (1)_result.webp,/img/gallery/DHL_result.webp,/img/gallery/FDV_9742 a_result.webp,/img/gallery/HCM-1_result.webp,/img/gallery/HCM-2_result.webp,/img/gallery/LYZA_result.webp,/img/gallery/SANIFER_result.webp,/img/gallery/SBM_result.webp'),
  (21, 'HPL Resoplan', 'HPL Resoplan', '/img/png/AKADIN Ambohimangakely_result.webp', '2023-10-11 16:54:41', '2023-10-11 16:54:41', '/img/pub/chevron-droit.png', 7, '/img/gallery/AKADIN Ambohimangakely_result.webp,/img/gallery/_MG_3952_result.webp,/img/gallery/_MG_4023-1_result.webp'),
  (22, 'Mur Rideau', 'Mur Rideau', '/img/png/_MG_4038_result.webp', '2023-10-11 16:55:22', '2023-10-11 16:55:22', '/img/pub/chevron-droit.png', 7, '/img/gallery/METAPLASCO-1_result.webp,/img/gallery/METAPLASCO-2_result.webp,/img/gallery/PIETRA (2)_result.webp,/img/gallery/PIETRA (4)_result.webp,/img/gallery/SOMACOPRIM-1_result.webp,/img/gallery/SOMACOPRIM-2_result.webp,/img/gallery/_MG_4038_result.webp,/img/gallery/_MG_7878_result.webp,/img/gallery/_MG_9897_result.webp,/img/gallery/_MG_9954_result.webp'),
  (23, 'Fibrociment', 'Fibrociment', '/img/png/HCM (5)_result.webp', '2023-10-11 16:55:59', '2023-10-11 16:55:59', '/img/pub/chevron-droit.png', 7, '/img/gallery/0083_EuropAlu _17-09-28_result.webp,/img/gallery/akadin_20180822_054_result.webp,/img/gallery/DJI_0022_result.webp,/img/gallery/DSC_8523_result.webp,/img/gallery/HCM (5)_result.webp,/img/gallery/IMG_1739_result.webp,/img/gallery/_MG_7805-1_result.webp'),
  (24, 'Cloisons', 'Cloisons', '/img/png/CLOISON_result.webp', '2023-10-11 19:10:47', '2023-10-11 19:10:47', '/img/pub/chevron-droit.png', 8, '/img/gallery/FDV_9594_result.webp,/img/gallery/IMG_5384_result.webp,/img/gallery/_MG_1333_result.webp,/img/gallery/_MG_2381_result.webp,/img/gallery/_MG_5601_result.webp,/img/gallery/_MG_6608_result.webp,/img/gallery/_MG_7748_result.webp,/img/gallery/_MG_7754_result.webp,/img/gallery/_MG_9964_result.webp'),
  (25, 'Moustiquaire Fixe', 'Moustiquaire Fixe', '/img/png/MOUSTIQUAIRE_result.webp', '2023-10-11 19:11:37', '2023-10-11 19:11:37', '/img/pub/chevron-droit.png', 8, '/img/gallery/146713_2_result.webp,/img/gallery/moustiquaire_result.webp'),
  (26, 'Moustiquaire Coulissante', 'Moustiquaire Coulissante', '/img/png/MOUSTIQUAIRE COULISSANTE.png', '2023-10-11 19:12:26', '2023-10-13 15:31:16', '/img/pub/chevron-droit.png', 8, '/img/gallery/_MG_7774-1_result.webp,/img/gallery/_MG_7777-1_result.webp,/img/gallery/_MG_7812-1_result.webp,/img/gallery/_MG_9330-1_result.webp'),
  (27, 'Moustiquaire Enroulable', 'Moustiquaire Enroulable', '/img/png/MOUSTIQUAIRE ENROULABLE.png', '2023-10-11 19:13:26', '2023-10-13 15:31:24', '/img/pub/chevron-droit.png', 8, '/img/gallery/_MG_2519_result.webp,/img/gallery/_MG_2553-1_result.webp'),
  (28, 'Store Californien', 'Store Californien', '/img/png/STOR CALIFORNIEN_result.webp', '2023-10-11 19:14:37', '2023-10-11 19:14:37', '/img/pub/chevron-droit.png', 8, '/img/gallery/IMG_5443_result.webp,/img/gallery/_MG_2353_result.webp,/img/gallery/_MG_7230_result.webp,/img/gallery/_MG_7242_result.webp'),
  (29, 'Store Enroulable', 'Store Enroulable', '/img/png/STORE ENROULABLE.png', '2023-10-11 19:15:26', '2023-10-13 15:30:22', '/img/pub/chevron-droit.png', 8, '/img/gallery/_MG_2372-1_result.webp,/img/gallery/_MG_2466_result.webp,/img/gallery/_MG_3888-1_result.webp,/img/gallery/_MG_7262_result.webp'),
  (30, 'Store Venetien', 'Store Venetien', '/img/png/STORE VENITIEN.png', '2023-10-11 19:16:59', '2023-10-13 15:30:41', '/img/pub/chevron-droit.png', 8, '/img/gallery/heytens-store-venitien-horizontale-lamellen-h7_result.webp,/img/gallery/heytens-store-venitien-horizontale-lamellen-v5_result.webp,/img/gallery/store-venitien-aluminium-blanc-avec-galons-tissu_result.webp,/img/gallery/_MG_7240_result.webp'),
  (31, ' Brise-Soleil Horizontale', ' Brise-Soleil Horizontale', '/img/png/BRISE-SOLEIL_result.webp', '2023-10-11 19:18:53', '2023-10-11 19:18:53', '/img/pub/chevron-droit.png', 9, '/img/gallery/akadin_20180822_022_result.webp,/img/gallery/JOVENNA (2)_result.webp,/img/gallery/_MG_5789_result.webp,/img/gallery/_MG_7798_result.webp'),
  (32, ' Brise-Soleil Verticale', 'Brise-Soleil Verticale', '/img/png/BRISE-SOLEIL VERTICAL.png', '2023-10-11 19:20:07', '2023-10-13 16:11:20', '/img/pub/chevron-droit.png', 9, '/img/gallery/0091_EuropAlu _17-09-28-1_result.webp,/img/gallery/DSC_8078-1_result.webp,/img/gallery/EA-1_result.webp,/img/gallery/_MG_5728_result.webp,/img/gallery/_MG_7817-1_result.webp'),
  (33, ' Pergolas ', ' Pergolas Fixe', '/img/png/PERGOLAS_result.webp', '2023-10-11 19:26:15', '2023-10-11 19:26:15', '/img/pub/chevron-droit.png', 9, '/img/gallery/20140927_133041_result.webp,/img/gallery/IMG_2783_result.webp,/img/gallery/_MG_9052_result.webp,/img/gallery/_MG_9053_result.webp'),
  (34, ' Store Banne', ' Store Banne', '/img/png/STORE BANNE_result.webp', '2023-10-11 19:27:23', '2023-10-11 19:27:23', '/img/pub/chevron-droit.png', 9, '/img/gallery/Brustor-B50-7-DayTime_edit_1080x1080_result.webp,/img/gallery/Capture st_result.webp,/img/gallery/Store banne_result.webp'),
  (35, 'Grilles Bijoutier', 'Grilles Bijoutier', '/img/png/GRILLE BIJOUTIER_result.webp', '2023-10-11 19:29:00', '2023-10-11 19:29:00', '/img/pub/chevron-droit.png', 12, '/img/gallery/00000149_result.webp,/img/gallery/_MG_0352-1_result.webp,/img/gallery/_MG_1953_result.webp,/img/gallery/_MG_7534_result.webp'),
  (36, 'Portes Sectionnelles', 'Portes Sectionnelles', '/img/png/PORTE SECTIONNELLE_result.webp', '2023-10-11 19:30:05', '2023-10-11 19:30:05', '/img/pub/chevron-droit.png', 12, '/img/gallery/_MG_4885_result.webp,/img/gallery/_MG_7701-1_result.webp,/img/gallery/_MG_7707_result.webp,/img/gallery/_MG_8080_result.webp,/img/gallery/_MG_8108_result.webp'),
  (37, 'Volets Battantes', 'Volets Battantes', '/img/png/VOLET BATTANT.png', '2023-10-11 19:31:16', '2023-10-16 08:23:41', '/img/pub/chevron-droit.png', 12, '/img/gallery/_DSC4871_result.webp,/img/gallery/_DSC8812_result.webp'),
  (38, 'Volets Coulissante', 'Volets Coulissante', '/img/png/VOLET COULISSANT_result.webp', '2023-10-11 19:32:51', '2023-10-11 19:32:52', '/img/pub/chevron-droit.png', 12, '/img/gallery/_MG_4894-1_result.webp'),
  (39, 'Volets Roulantes', 'Volets Roulantes', '/img/png/VOLET ROULANT_result.webp', '2023-10-11 19:34:35', '2023-10-11 19:34:35', '/img/pub/chevron-droit.png', 12, '/img/gallery/DSC_8457_result.webp,/img/gallery/IMG_8212_result.webp,/img/gallery/_MG_3667_result.webp,/img/gallery/_MG_7868-1_result.webp,/img/gallery/_MG_7927-1_result.webp,/img/gallery/_MG_7977_result.webp'),
  (40, 'Baies Coulissante', 'Baies Coulissante', '/img/png/BAIE COULISSANTE_result.webp', '2023-10-11 21:00:31', '2023-10-11 21:00:31', '/img/pub/chevron-droit.png', 10, '/img/gallery/_MG_2892_result.webp,/img/gallery/_MG_7844-1_result.webp,/img/gallery/_MG_8014-1_result.webp'),
  (41, 'Baies Vitrée à Galandage', 'Baies Vitrée à Galandage', '/img/png/BAIE GALANDAGE_result.webp', '2023-10-11 21:01:37', '2023-10-11 21:01:37', '/img/pub/chevron-droit.png', 10, '/img/gallery/_MG_3648-1_result.webp,/img/gallery/_MG_3692_result.webp'),
  (42, ' Baies Chassis Fixes', ' Baies Chassis Fixes', '/img/png/BAIE FIXE_result.webp', '2023-10-11 21:06:43', '2023-10-11 21:06:44', '/img/pub/chevron-droit.png', 10, '/img/gallery/_MG_3727_result.webp,/img/gallery/_MG_5648_result.webp,/img/gallery/_MG_7795-1_result.webp'),
  (43, 'Garde Corps Brossé', 'Garde Corps Brossé', '/img/png/GARDE-CORP-ALU-BROSSE_result.webp', '2023-10-11 21:07:58', '2023-10-11 21:07:58', '/img/pub/chevron-droit.png', 11, '/img/gallery/1_result.webp,/img/gallery/7a_result.webp,/img/gallery/_DSC0114_result.webp,/img/gallery/_MG_3979_result.webp,/img/gallery/_MG_7782_result.webp,/img/gallery/_MG_8840_result.webp'),
  (44, 'Garde Corps Vitrée', 'Garde Corps Vitrée', '/img/png/GARDE-CORP-VITREE_result.webp', '2023-10-11 21:09:17', '2023-10-11 21:09:17', '/img/pub/chevron-droit.png', 11, '/img/gallery/AKOOR (23)_result.webp,/img/gallery/DSC_8429_result.webp,/img/gallery/IMG_5210_result.webp,/img/gallery/_MG_3859_result.webp,/img/gallery/_MG_5720_result.webp,/img/gallery/_MG_7905_result.webp,/img/gallery/_MG_8689_result.webp,/img/gallery/_MG_8963_result.webp,/img/gallery/_MG_9276_result.webp,/img/gallery/_MG_9961-1_result.webp');
  `)
  await db.sequelize.query(`INSERT INTO users (ID_user, avatar, name, email, phone, password, refreshToken, role, type, createdAt, updatedAt) VALUES
  (1, '/avatar/woman-users.png', 'fd', 'fd@gmail.com', 345862164, '$2b$10$y45TI0ey6lErzXUqdrepA.9phu9LjDMGq52NrCnbE2gTnXi1gq7ta', '', 4215, 'Entreprise', '2023-09-25 08:08:17', '2023-10-13 08:42:49'),
  (2, '/avatar/Avatar-Profile.png', 'hardy', 'hardy@gmail.com', 345862164, '$2b$10$8H2ojoLNr8gtsySVv16/QO2wdlbuP0yxRy0X8g0Oh4tRQYlSKdw82', '', 4215, 'Particulier', '2023-09-25 08:08:51', '2023-10-20 11:18:24'),
  (9, '/img/avatar/coupe-homme-bordeaux-683x1024.webp', 'hds', 'hds@gmail.com', 345862164, '$2b$10$fHqoi24bpxneNCOZY8Jc4O2Ew7AeUFHYBSY3v1Ogh5uZQb/SMKSae', '', 9623, NULL, '2023-10-03 11:51:40', '2023-10-20 11:17:45'),
  (10, '/avatar/woman-users.png', 'sdf', 'sdf@gmail.com', 345862164, '$2b$10$h2xjAyKT4cZU783GDyEP.OhP5jiPur4I0z0Q3P2cl7DK9E1pFHfRS', '', 4215, 'Particulier', '2023-10-03 12:00:40', '2023-10-16 14:30:44'),
  (14, '/img/avatar/admin.png', 'cedrico', 'cedio@gmail.com', 345862164, '$2b$10$mFI5KfWyzVBrUuwOUsDLruO1ewJ3cVIkJi8GIK6ZTUXt0gUXlBtHe', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTY5Nzc5MDMyOCwiZXhwIjoxNjk3ODc2NzI4fQ.yppJdnnuSh8eASopWDh9wRXno1_XawxkyM5jmJMvSug', 3645, NULL, '2023-10-04 11:21:35', '2023-10-20 11:25:28'),
  (15, '/avatar/user-profile.png', 'Hezio', 'Hezio@gmail.com', 345862164, '$2b$10$SX6D6rfeJjJ1U4nGg0bH3eK7vfb/2ZsWyeC8dq.H7oRGPxmW0XLXa', '', 4215, 'Entreprise', '2023-10-04 11:22:47', '2023-10-16 14:33:58'),
  (18, '/avatar/woman-business.png', 'ref', 'ref@gmail.com', 2147483647, '$2b$10$KQvi.bhMI1NIU0NW2Np7COyuvOSKTUa8iXeJlX05z67quQ5mnbJYu', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImlhdCI6MTY5NzQ1ODcyMCwiZXhwIjoxNjk3NTQ1MTIwfQ.7AhHYYIrUF3clv9amAzBMzrUK8Rs-iabnD41Cw3gQiM', 4215, 'Particulier', '2023-10-05 07:09:55', '2023-10-16 15:18:40'),
  (19, '/avatar/user-profile.png', 'DevelSyntex', 'devel@gmail.com', 2147483647, '$2b$10$xJUFIyljtMUbLMSxzoNYk.mdwmcKvJM/fO7RNuGmqFw58Cs1wERvO', '', 4215, 'Entreprise', '2023-10-10 07:36:06', '2023-10-10 10:17:27'),
  (20, '/avatar/woman-business.png', 'dn', 'dn@gmail.com', 2147483647, '$2b$10$j9ehH43aYaexFwzsnwQ5i.3jl1bRbkcnAi3080DPExJ30zAJIgTFe', '', 4215, 'Particulier', '2023-10-10 10:36:25', '2023-10-13 08:55:00'),
  (21, '/avatar/User-avatar.png', 'hd', 'hd@gmail.com', 2147483647, '$2b$10$JwRMkVj.XCaRMbBuMln/Xee6VpFd0AOu3qUX1DwAY1sUks/rILtZu', '', 4215, 'Particulier', '2023-10-10 10:40:59', '2023-10-10 10:50:30'),
  (22, '/avatar/User-avatar.png', 'ESTI', 'esti@gmail.mg', 2147483647, '$2b$10$wUHXf4lx7uVsfpQ69P0k8O.XNeL0mJIY6.cq8woZXrBEajMHf03V2', '', 4215, 'Entreprise', '2023-10-10 11:02:51', '2023-10-13 08:46:27'),
  (23, '/avatar/woman-business.png', 'cedi', 'cedi@gmail.com', 1212121212, '$2b$10$QBAT6gu8aPqAfHJnBZMI2O1nJQMhbXzBGb8NZMPIf.szcPAvxy5RW', '', 4215, 'Particulier', '2023-10-10 11:06:11', '2023-10-13 08:56:34'),
  (24, '/avatar/woman-business.png', 'Clo', 'clo@gmail.com', 2147483647, '$2b$10$oEluVKD5IyhxZeUhu93U5.JKdwYgvBBgIJHbhFhpkUX6vFppJBbHq', '', 4215, 'Particulier', '2023-10-13 08:15:06', '2023-10-13 08:39:36');
  `)
  // await db.sequelize.query(`mysql > SET PERSIST sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)
  server.listen(process.env.PORT, "0.0.0.0",() => {
    console.log(`http://127.0.0.1:${process.env.PORT}`);
  });
});

app.use(express.static("/public/dist/"));

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
