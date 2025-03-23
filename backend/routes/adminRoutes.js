const express = require("express");
const { getAllServicesAndPlaces, addServiceOrPlace, deleteServiceOrPlace, getHistory } = require("../controllers/adminController");

const router = express.Router();

router.get("/service-place", getAllServicesAndPlaces);
router.post("/add-service-place", addServiceOrPlace);
router.delete("/delete-service-place", deleteServiceOrPlace);

router.get("/service-history", getHistory);

module.exports = router;
