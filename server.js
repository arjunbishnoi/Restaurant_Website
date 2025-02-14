// ------------------------- REQUIREMENTS --------------------------
// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
require('dotenv').config();
const path = require("path");

// App Defined
const app = express();
const port = process.env.PORT || 8080;

// Handlebars Setup
app.set('view engine', 'hbs'); // Set Handlebars as the templating engine
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (for form submissions)
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
app.use(express.json()); // Parse JSON request bodies

// Middleware
app.use(session({ 
    secret: "secret", 
    resave: false, 
    saveUninitialized: false 
})); // Session middleware for managing user sessions
app.use(fileUpload()); // Middleware for handling file uploads
app.use(morgan('dev')); // Logging middleware for development purposes

// ------------------------- HOME PAGE ----------------------------
// Route to render the homepage
app.get("/", (req, res) => res.render("./homepage.hbs"));

// ----------------------- ROUTES SECTION ---------------------------
// Import and use routes for different sections of the application
const menuRoutes = require('./routes/menuRoutes'); // Routes for the Menu website
const adminRoutes = require('./routes/adminRoutes'); // Routes for the Admin website
const driverRoutes = require('./routes/driverRoutes'); // Routes for the Driver website
const Order = require("./models/order"); // Import the Order model

// Use the imported routes with their respective base paths
app.use('/menu', menuRoutes);
app.use('/admin', adminRoutes);
app.use('/driver', driverRoutes);

// Checkout Page Route
// This route renders the checkout page
app.get("/checkout", (req, res) => res.render("checkout"));

// Handle Order Placement
// This route processes the order submission from the customer
app.post("/order", async (req, res) => {
    try {
        const { customerName, customerAddress, totalPrice, time } = req.body;

        // Create a new order using the data from the request body
        const newOrder = new Order({ 
            customerName, 
            customerAddress, 
            totalPrice, 
            time 
        });

        // Save the new order to the database
        await newOrder.save();

        // Respond with a success message
        return res.json({ message: "Order placed successfully!" });
    } catch (err) {
        console.error("Error placing order:", err.message);
        // Respond with an error message if something goes wrong
        return res.json({ error: "Failed to place order" });
    }
});

// --------------------- SERVER AND MONGODB ------------------------
// MongoDB Connection and Server Start
const startServer = async () => {
    console.log(`The server is running on http://localhost:${port}`);
    console.log("Press CTRL + C to exit");

    try {
        const mongoURI = process.env.MONGO_URI;

        // Check if the MongoDB connection string is defined in the environment variables
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the environment variables.');
        }

        // Connect to MongoDB using the provided connection string
        await mongoose.connect(mongoURI);
        console.log("Success! Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Exit the process if there's an error connecting to MongoDB
    }
};

// Start the server and listen on the specified port
app.listen(port, startServer);