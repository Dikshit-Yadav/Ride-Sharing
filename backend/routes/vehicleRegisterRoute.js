const express = require("express");
const router = express.Router();
const { registerVehicle, userVehicles } = require("../controller/vehicleRegister");
const auth = require("../middleware/authmiddleware")

router.post("/register", auth, registerVehicle);
router.get("/my", auth, userVehicles)
module.exports = router;
