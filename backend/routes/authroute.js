const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgetPassword,
  resetPassword,
  logout
} = require("../controller/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/logout", logout)

module.exports = router;
