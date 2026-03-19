const express = require("express");
const router = express.Router();
const {myProfile, updateProfile, uploadProfilePic,getProfilePic} = require("../controller/myProfile")
const auth = require("../middleware/authmiddleware")

router.post("/pic/upload", auth, uploadProfilePic);
router.get("/my", auth, myProfile)
router.put("/edit/:id", auth, updateProfile)
router.get("/pic/:filename", auth, getProfilePic)

module.exports = router;