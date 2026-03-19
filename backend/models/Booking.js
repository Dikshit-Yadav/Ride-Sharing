const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true
    },
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingSeats: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        required: true
    },
    time:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
