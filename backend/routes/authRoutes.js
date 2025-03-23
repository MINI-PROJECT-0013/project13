const express = require("express");
const router = express.Router();
const {loginUser, list, sendNotification, comment, rating} = require("../controllers/authControllers");

router.route("/auth").post(loginUser);

router.route("/list").get(list);
router.route("/bookings").post(sendNotification);
router.route("/submit-comment").post(comment);
router.route("/submit-rating").post(rating);

module.exports = router;