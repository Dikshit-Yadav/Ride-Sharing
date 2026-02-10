const Vehicle = require("../models/Vehicle");

exports.registerVehicle = async (req, res) => {
  try {
    const { VhNumber, VhModel, TotalSeats } = req.body;

    const userId = req.user.id;

    const exists = await Vehicle.findOne({ VhNumber });
    if (exists) {
      return res.status(400).json({ message: "vehicle already registered" });
    }

    const vehicle = await Vehicle.create({
      user: userId,
      VhNumber,
      VhModel,
      TotalSeats,
    });

    res.status(201).json({
      message: "vehicle registered successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user.id });

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};


