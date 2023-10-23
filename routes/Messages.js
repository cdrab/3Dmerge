const express = require("express");
const router = express.Router();
const verifyRole = require("../middlewares/verifyRole");
require("dotenv").config();
const verifyJWT = require("../middlewares/verifyJWT");
const multer = require("multer");
const path = require("path");
const {
  addMessage,
  getMessage,
  getLastMessage,
  getUsers,
  getMessageNotif,
} = require("../controllers/messageController");

const imgPath = path.join(__dirname, "..", "public", "img");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.fieldname == "file") {
      const homeImg = path.join(imgPath, "file");
      callback(null, homeImg);
    }
  },

  filename: function (req, file, callback) {
    callback(null, Buffer.from(file.originalname, "latin1").toString("utf8"));
  },
});

const upload = multer({
  storage: storage,
});

const multipleField = upload.fields([{ name: "file" }]);

router.post("/", multipleField, addMessage);

router.post("/get", verifyJWT, getMessage);

router.get("/getlast", verifyJWT, getLastMessage);

router.get("/getUsers", verifyJWT, getUsers)

router.get("/getNotif", verifyJWT, getMessageNotif)


module.exports = router;
