const express = require("express");
const Ride = require("../models/Ride")
const Vehicle = require("../models/Vehicle")
const Booking = require("../models/Booking")



exports.rideCreate = async (req, res) => {
    try {
        const {
            source,
            destination,
            date,
            time,
            price,
            seats,
            vehicle
        } = req.body

        // const vehicle = await Vehicle.findOne({ user: req.user.id });

        const ride = await Ride.create({
            driver: req.user.id,
            vehicle,
            source,
            destination,
            date,
            time,
            price,
            seats
        })

        res.status(201).json({
            message: "ride created",
            ride
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.myRides = async (req, res) => {
    try {
        const user = req.user.id;
        const booking = await Booking.find({ passenger: user })
            .populate("ride");
        res.status(200).json({
            count: booking.length,
            booking
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.publicedRide = async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.user.id }).populate("vehicle").populate("driver").sort({ createdAt: -1 });
        res.status(200).json({
            count: rides.length,
            rides
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

exports.deleteRide = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id);

        ride.deleteOne();
        res.status(200).json({ message: "ride deleted successfully" });
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
};




exports.findRide = async (req, res) => {
    try {
        const { source, destination, date, seats } = req.query;
        const rides = await Ride.find({
            source: { $regex: source, $options: "i" },
            destination: { $regex: destination, $options: "i" },
            date,
            seats: { $gte: seats }
        }).populate("driver", "name").populate("vehicle").limit(15).sort({ createdAt: -1 });
        res.status(200).json({
            count: rides.length,
            rides
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.similarRide = async (req, res) => {
    try {
        const { id } = req.params;
        const ride = await Ride.findById(id);

        if (!ride) {
            return res.status(404).json({ message: "ride not found" });
        }

        const similarRides = await Ride.find({
            id: { $ne: id },
            source: ride.source,
            destination: ride.destination,
            date: ride.date
        }).populate("driver", "name").populate("vehicle");

        res.status(200).json({
            count: similarRides.length,
            similarRides
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.bookRide = async (req, res) => {
    try {
        const { ride: rideId, passenger: passengerId } = req.body;
        const ridec = await Ride.findById(rideId);

        if (!ridec) {
            return res.status(404).json({ message: "Ride not found" });
        }

        const alreadyBooked = await Booking.findOne({
            ride: rideId,
            passenger: passengerId,
        });

        if (ridec.driver.toString() === req.user.id.toString()) {
            return res.status(400).json({
                message: "You cannot book your own ride.",
            });
        }
        
        if (alreadyBooked) {
            return res.status(400).json({
                message: "You have already booked this ride.",
            });
        }

        const booking = await Booking.create(req.body);
        const ride = await Ride.findById(booking.ride).populate("driver");
        const bookingDetails = await Booking.findById(booking._id).populate("passenger");
        req.io.to(ride.driver._id.toString()).emit("booking", {
            type: "BOOKING_REQUEST",
            message: `New booking request from ${bookingDetails.passenger.name} with ${booking.bookingSeats} seats`,
            rideID: ride._id,
            passengerID: booking.passenger,
            bookingId: booking._id,
            createdAt: new Date().toISOString(),
        });

        res.status(201).json({ message: "Booking request sent.", booking });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        console.log(booking)
        if (!booking) {
            return res.status(404).json({ message: "booking not found" });
        }
        booking.status = "confirmed";
        await booking.save();

        const passengerId = booking.passenger.toString();
        req.io.to(passengerId).emit("bookingStatus", {
            type: "Booking_Confirmed",
            message: "Your booking has been confirmed",
            bookingId: booking._id,
            rideId: booking.ride,
            createdAt: new Date().toISOString(),
        });
        res.json({ booking });


    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "rejected";
        await booking.save();

        req.io.to(booking.passenger.toString()).emit("bookingStatus", {
            type: "Booking_Rejected",
            message: "Your booking request was rejected.",
            bookingId: booking._id,
            rideId: booking.ride,
        });

        res.status(200).json({ booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
