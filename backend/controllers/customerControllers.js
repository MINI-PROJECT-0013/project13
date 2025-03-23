const asyncHandler = require("express-async-handler");
const bycrypt = require("bcryptjs");
const Customer = require("../models/customerModel");

const registerC = asyncHandler(async(req, res) => {
    try{
        console.log(req.body);
        const {FirstName,LastName, address, City, State, ZipCode, phoneNo, email, password} = req.body;
        if (!email || !password || !FirstName || !LastName || !phoneNo || !address || !City || !State || !ZipCode){ 
            return res.status(400).json({message: "All fields are required"});
        }

        const existingCustomer = await Customer.findOne({email});
        if (existingCustomer){
            return res.status(400).json({message: "Customer already exists"});
        }

        const salt = await bycrypt.genSalt(10);
        const hashPassword = await bycrypt.hash(password, salt);
        const newCustomer = await Customer.create({
            FirstName,
            LastName,
            address,
            City,
            State,
            ZipCode,
            phoneNo,
            email,
            password: hashPassword,
        });

        await newCustomer.save();
        res.status(201).json({message: "User created successfully"});
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }

});

const profileC = asyncHandler(async(req, res) => {
    const id = req.params.id;
        try{
            const customer = await Customer.findById(id);
            if (!customer){
                return res.status(404).json({message: "Customer not found"});
            }
            res.status(200).json(customer);
        }
        catch(error){
            return res.status(500).json({message: error.message});
        }
});

const users = asyncHandler(async(req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

const deleteUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params; // Extract ID from request params

        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error });
    }
});

module.exports = {registerC, profileC, users, deleteUser};