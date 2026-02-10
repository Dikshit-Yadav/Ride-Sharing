const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgetPassword,
  resetPassword
} = require("../controller/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
