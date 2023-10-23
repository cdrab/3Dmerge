const express = require("express");
const router = express.Router();
const {
  addTraker,
  getTraker,
  getTrakers,
  getTopProduct,
  nbrProdByTrack,
  getProdByInterested,
} = require("../controllers/trakerController");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyUserExist = require("../middlewares/verifyUserExist");
const verifyRole = require("../middlewares/verifyRole");

router.post("/", verifyUserExist, addTraker);

router.get("/", verifyJWT, getTraker);

router.post("/top", verifyJWT, verifyRole(process.env.PRIME1), getTopProduct)

router.post("/nbrProd", verifyJWT, verifyRole(process.env.PRIME1), nbrProdByTrack)

router.get("/all", verifyJWT, verifyRole(process.env.PRIME1), getTrakers);

router.post("/single", verifyJWT, verifyRole(process.env.PRIME1), getProdByInterested);

module.exports = router;