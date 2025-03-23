const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const twilio = require("twilio");
const Customer = require("../models/customerModel");
const Professional = require("../models/professionalModel");
const Admin = require("../models/adminModel");
const History = require("../models/historyModel");
const dotenv = require("dotenv").config();

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const generateToken = (id, userType) => {
    return jwt.sign(
        { id, userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};


//@desc Send the email nd password to server for authorization
//@route POST /login
//@access protected

const loginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body; // storing email and password in the variables
    if (!email || !password) {
        return res.status(400).json({message: "All fields are required"}); // if email or password is not provided then return a message in json format and status is set to 400
    }
    try {
        let user = await Customer.findOne({email});
        let userType = "Customer";
        if (!user) {
            user = await Professional.findOne({email});
            userType = "Professional";

        }
        if (!user) {
            user = await Admin.findOne({email});
            userType = "Admin";
        }
        if (!user) {
            return res.status(400).json({message: "Invalid email"}); // if user is not found in the database then return a message in json format and status is set to 400
        }

        const isMatch = await bycrypt.compare(password,user.password); // comparing the password entered by the user with the password stored in the database
        if (!isMatch){
            return res.status(400).json({message: "Invalid password"}); // if password is incorrect then return a message in json format and status is set to 400
        }

        const token = generateToken(user._id, userType); // generating token for the user

        res.status(200).json({
            message: `Login Successful, Welcome ${userType}`,
            token,
            userType,
            userId: user._id
        });

    }
    catch (error) {
        return res.status(500).json({message: error.message}); // if there is an error then return a message in json format and status is set to 500
    }
});


const list = asyncHandler(async(req, res) => {
    const {id, service, location} = req.query;
    console.log("Received service:", service);
    console.log("Received location:", location);
    console.log("Type of service:", typeof service);
    console.log("Type of location:", typeof location);

    try {
        if (!id || !service || !location) {
            console.log("Missing parameters!");
            return res.status(400).json({ error: "Missing query parameters" });
            //return res.status(400).json({message: "Service and place are required"});
        }

        const professionals = await Professional.find({
            profession: service,  
            location: location,
            isAvailable: true
        }).select("-password");
        console.log(professionals);
        res.status(200).json(professionals || []);
    }
    catch (error) {
        //return res.status(500).json({message: error.message});
        console.error("Error in /list endpoint:", error);
        return res.status(500).json({ message: error.message, stack: error.stack });
    }
});


const sendNotification = asyncHandler(async(req, res) => {
    const {professionalId, professionalEmail, professionalName, professionalPhone, complaint, userId, service} = req.body;
    if (!professionalId || !professionalEmail || !professionalName || !professionalPhone || !complaint || !userId || !service) {
        return res.status(400).json({message: "All fields are required"});
    }
    console.log(professionalId, professionalEmail, professionalName, professionalPhone, complaint, userId);

    await Professional.findByIdAndUpdate(professionalId, { isAvailable: false });

    const user = await Customer.findById(userId);
    const userName = `${user.FirstName} ${user.LastName}`;

    const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
    const msg = `New complaint from ${userName}\nAddress: ${user.address}\nPhone: ${user.phoneNo}\nEmail: ${user.email}\nComplaint: ${complaint}`
    await client.messages.create({
        body: msg,
        from: TWILIO_PHONE_NUMBER,
        to: `+91${professionalPhone}`
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
    const formattedTime = currentDate.toLocaleTimeString(); // Get HH:MM AM/PM format

    await addHistory(service, professionalId, userId, formattedDate, formattedTime);

    setTimeout(() => {
        Professional.findByIdAndUpdate(professionalId, { isAvailable: true })
            .then(() => console.log("Professional availability updated after timeout"))
            .catch((err) => console.error("Error updating availability:", err));
    },3 * 60 * 60 * 1000);  

    console.log("SMS sent successfully:", message.sid);
    res.status(200).json({ message: "Notification sent successfully!" });
});

const comment = asyncHandler(async(req, res) => {
    try {
        const { professionalId, userId, comment } = req.body;

        if (!professionalId || !userId || !comment) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const professional = await Professional.findById(professionalId);
        if (!professional) {
            return res.status(404).json({ message: "Service provider not found." });
        }

        // Add the comment
        professional.comments.push({ userId, comment });
        await professional.save();

        res.json({ message: "Comment added successfully!", comments: professional.comments });
    } catch (error) {
        res.status(500).json({ message: "Error submitting comment", error: error.message });
    }
});


const rating = asyncHandler(async (req, res) => {
    try {
        const { professionalId, userId, rating } = req.body;

        if (!professionalId || !userId || !rating) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const professional = await Professional.findById(professionalId);
        if (!professional) {
            return res.status(404).json({ message: "Service provider not found." });
        }

        // Remove old rating from the same user if exists
        professional.ratings = professional.ratings.filter((r) => r.userId !== userId);

        // Add new rating
        professional.ratings.push({ userId, rating });

        // Calculate new average rating
        const totalRatings = professional.ratings.length;
        const avgRating = professional.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        professional.rating = avgRating;

        await professional.save();

        res.json({ message: "Rating submitted successfully!", rating: professional.rating });
    } catch (error) {
        res.status(500).json({ message: "Error submitting rating", error: error.message });
    }
});


const addHistory = async (service, professionalId, customerId, date, time) => {
    try {
        const newHistory = new History({
            service,
            professional: professionalId,
            customer: customerId,
            date,
            time,
            day: new Date(date).toLocaleString("en-us", { weekday: "long" }) // Extract day name
        });
        await newHistory.save();
        console.log("History added successfully!");
    } catch (error) {
        console.error("Error adding history:", error);
    }
};


module.exports = {loginUser, list, sendNotification, comment, rating};