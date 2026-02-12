const express = require("express");
const router = express.Router();
const { registerVehicle, userVehicles, deleteVehicle} = require("../controller/vehicleRegister");
const auth = require("../middleware/authmiddleware")

router.post("/register", auth, registerVehicle);
router.get("/my", auth, userVehicles)
router.delete("/delete/:id", auth, deleteVehicle)
module.exports = router;
