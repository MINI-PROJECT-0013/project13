const ServicesAndPlaces = require("../models/servicePlaces");
const History = require("../models/historyModel");

// Fetch all services and places
const getAllServicesAndPlaces = async (req, res) => {
    try {
        const data = await ServicesAndPlaces.find();
        if (!data) return res.status(404).json({ message: "No data found" });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Add new service or place
const addServiceOrPlace = async (req, res) => {
    try {
        const { service, place } = req.body;

        let data = await ServicesAndPlaces.findOne();
        if (!data) {
            data = new ServicesAndPlaces({ services: [], places: [] });
        }

        if (service && !data.services.includes(service)) {
            data.services.push(service);
        }
        if (place && !data.places.includes(place)) {
            data.places.push(place);
        }

        await data.save();
        res.status(200).json({ message: "Added successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const deleteServiceOrPlace = async (req, res) => {
    try {
        const { service, place } = req.body;

        let data = await ServicesAndPlaces.findOne();
        if (!data) return res.status(404).json({ message: "No data found" });

        if (service) {
            data.services = data.services.filter(s => s !== service);
        }
        if (place) {
            data.places = data.places.filter(p => p !== place);
        }

        await data.save();
        res.status(200).json({ message: "Deleted successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


const getHistory = async(req, res) => {
    try {
        const historyRecords = await History.find()
            .populate("professional", "firstName lastName") // Fetch only the professional's name
            .populate("customer", "FirstName LastName") // Fetch only the customer's name
            .sort({ date: -1 }); // Sort by latest date

            console.log(historyRecords);
        res.status(200).json(historyRecords);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error });
    }
};

module.exports = { getAllServicesAndPlaces, addServiceOrPlace, deleteServiceOrPlace ,getHistory};
