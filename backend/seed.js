import mongoose from "mongoose";
import Ride from "./models/Ride.js";
import Vehicle from "./models/Vehicle.js";
import User from "./models/User.js"; // ✅ THIS LINE FIXES THE ERROR

const MONGO_URI = "mongodb+srv://2004dikshityadav_db_user:J0MKBR4jI7E4TH6j@blabla.a8wplcy.mongodb.net/?appName=Blabla";
const SAME_DATE = "2026-02-15";

async function seedRides() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const vehicles = await Vehicle.find().populate("user");

    if (!vehicles.length) {
      console.log("❌ No vehicles found");
      process.exit();
    }

    const routes = [
      { source: "Gurugram, Haryana", destination: "Delhi", price: 400 },
      { source: "Delhi", destination: "Jaipur, Rajasthan", price: 800 },
      { source: "Chandigarh, Punjab", destination: "Ludhiana, Punjab", price: 350 },
      { source: "Hisar, Haryana", destination: "Bikaner, Rajasthan", price: 900 },
    ];

    const times = ["06:30", "08:00", "10:15", "13:00", "17:45"];

    const rides = [];

    routes.forEach((route) => {
      times.forEach((time, i) => {
        const vehicle = vehicles[(rides.length + i) % vehicles.length];

        rides.push({
          source: route.source,
          destination: route.destination,
          date: SAME_DATE,            // same date
          time,                        // different time
          price: route.price,
          seats: Math.floor(Math.random() * 2) + 2,
          driver: vehicle.user._id,    // ✅ different drivers
          vehicle: vehicle._id,
        });
      });
    });

    await Ride.deleteMany();
    await Ride.insertMany(rides);

    console.log(`✅ ${rides.length} rides inserted`);
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedRides();
