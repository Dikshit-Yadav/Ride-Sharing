const express = require("express");
const router = express.Router();
const {rideCreate, myRides, publicedRide,findRide, similarRide, bookRide, confirmBooking, rejectBooking, deleteRide,getRoutes, getPassengers} = require("../controller/rideController")
const auth = require("../middleware/authmiddleware")
router.post("/create", auth, rideCreate);
router.get("/routes", auth, getRoutes)
router.get("/my-rides", auth, myRides)
router.get("/publiced", auth, publicedRide)
router.delete("/delete/:id", auth, deleteRide)
router.get("/find", auth, findRide)
router.get("/similar/:id", auth, similarRide)
router.get("/passengers/:id", auth, getPassengers)
router.post("/book", auth, bookRide)
router.put("/confirm/:bookingId", auth, confirmBooking)
router.put("/reject/:bookingId", auth, rejectBooking)

module.exports = router;