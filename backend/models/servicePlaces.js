const mongoose = require("mongoose");

const ServicesAndPlacesSchema = new mongoose.Schema({
    services: { type: [String], default: [] }, // List of all available services
    places: { type: [String], default: [] } // List of all available places
});

const ServicesAndPlaces = mongoose.model("ServicesAndPlaces", ServicesAndPlacesSchema);
module.exports = ServicesAndPlaces;
