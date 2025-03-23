const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    service: {
        type: String,
        required: true
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    }
}, { timestamps: true });

const History = mongoose.model("History", historySchema);
module.exports = History;
