const express = require("express");
const router = express.Router();
const {chat} = require("../controller/chatController")
const auth = require("../middleware/authmiddleware");

router.get('/:recipientId', auth, chat);


module.exports = router;
