const express = require("express");
const router = express.Router();
const {
  addPage,
  getPages,
  updatePage,
  deletePage,
  uploadPageImage,
  getPage,
} = require("../controllers/pageController");
const verifyRole = require("../middlewares/verifyRole");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const verifyJWT = require("../middlewares/verifyJWT");

const imgPath = path.join(__dirname, "..", "public", "img");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    console.log(file);
    if (file.fieldname == "home") {
      const homeImg = path.join(imgPath, "home");
      callback(null, homeImg);
    } else if (file.fieldname == "icon") {
      const Icon = path.join(imgPath, "icon");
      callback(null, Icon);
    }
  },

  filename: function (req, file, callback) {
    callback(null, Buffer.from(file.originalname, "latin1").toString("utf8"));
  },
});

const upload = multer({
  storage: storage,
});

const multipleField = upload.fields([{ name: "home" }, { name: "icon" }]);

router.get("/", getPages);
router.get("/getPage/:id", getPage)

router
  .route("/upload")
  .post(multipleField, uploadPageImage)
  .put(multipleField, uploadPageImage);

router
  .route("/")
  .post(verifyJWT, verifyRole(process.env.PRIME1), addPage)
  .put(verifyJWT, verifyRole(process.env.PRIME1), updatePage);

router.delete("/:id", verifyJWT, verifyRole(process.env.PRIME1), deletePage);

module.exports = router;
