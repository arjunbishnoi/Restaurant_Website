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
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// Middleware
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(fileUpload());
app.use(morgan('dev'));

// ------------------------- HOME PAGE ----------------------------
app.get("/", (req, res) => res.render("./homepage.hbs"));

// ----------------------- ROUTES SECTION ---------------------------
// Routes
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/driverRoutes');
const Order = require("./models/order");
app.use('/menu', menuRoutes);
app.use('/admin', adminRoutes);
app.use('/driver', driverRoutes);

// Checkout Page Route
app.get("/checkout", (req, res) => res.render("checkout"));

// Handle Order
app.post("/order", async (req, res) => {
    try {
        const { customerName, customerAddress, totalPrice, time } = req.body;
        const newOrder = new Order({ customerName, customerAddress, totalPrice, time });
        await newOrder.save();
        return res.json({ message: "Order placed successfully!" });
    } catch {
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
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the environment variables.');
        }

        await mongoose.connect(mongoURI);
        console.log("Success! Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

app.listen(port, startServer);