const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    LastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    address: {
            type: String,
            required: [true, "House Number is required"],
        },
    City: {
        type: String,
        required: [true, "City is required"],
        },
    State: {
        type: String,
        required: [true, "State is required"],
        },
    ZipCode: {
        type: String,
        required: [true, "Zip Code is required"],
        },
    phoneNo: {
        type: String,
        required: [true, "Phone Number is required"],
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
});

module.exports = mongoose.model("Customer", customerSchema, "customers");
