const mongoose = require("mongoose");

const professionalSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phoneNo: {
        type: String,
        required: [true, "Phone Number is required"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    profession: {
        type: String,
        required: [true, "Profession is required"],
    },
    document: {
        type: String,
        required: [true, "Document is necessary for verification"],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    rating: { type: Number, default: 0 }, 
    ratings: [{ userId: String, rating: Number }], 
    comments: [{ userId: String, comment: String }] 
}, {
    timestamps: true,
});

module.exports = mongoose.model("Professional", professionalSchema,"professionals");
