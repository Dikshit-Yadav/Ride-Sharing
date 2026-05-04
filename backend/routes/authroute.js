const express = require("express");
const authmiddleware = require("../middleware/authmiddleware");
const router = express.Router();
const {
  register,
  login,
  forgetPassword,
  resetPassword,
  logout,
  isme
} = require("../controller/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logout)
router.get("/isme", authmiddleware, isme)

module.exports = router;