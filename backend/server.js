const express = require("express"); //define the express server and import the express
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config(); // import the dotenv module. config() loads the variables defined in .env file
const cors = require("cors");
const bodyParser = require("body-parser");

connectDB();

const app = express(); // create an instance of express server
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data
app.use(bodyParser.json());

app.use("/", require("./routes/authRoutes"));
app.use("/customer",require("./routes/customerRoutes"));
app.use("/professional",require("./routes/professionalRoutes"));
app.use("/admin",require("./routes/adminRoutes"));

app.use(errorHandler)


app.listen(port, () => {    // starts the function and makes it wait to listen for any request on port 5000
    console.log(`Server running on port ${port}`);
});
