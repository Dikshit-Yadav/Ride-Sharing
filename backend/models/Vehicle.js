const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    VhNumber: {
        type: String,
        required: true,
        unique: true
    },
    VhModel: {
        type: String,
        required: true,
    },
    TotalSeats: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
