// ------------------------- REQUIREMENTS --------------------------

// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const port = process.env.PORT || 8080
require('dotenv').config();

// 'App' Defined
const app = express()

// Handlebar 
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: false
}));
app.set('view engine', 'hbs');

// URL Encoding
app.use(express.urlencoded({ extended: true }))

// Global Constants and Variables 
const Driver = require("./models/driver.js");
const Order = require("./models/driver.js");



// ------------------------- HOME PAGE ----------------------------

app.get("/", (req, res) => {
    return res.render("home.hbs")
})



// ----------------------- MENU SECTION ---------------------------

app.get("/menu", (req, res) => {
    return res.render("./menu/menu.hbs")
})



// ----------------------- ADMIN SECTION --------------------------
app.get("/admin", (req, res) => {
    return res.render("./admin/admin.hbs")
})



// ---------------------- DRIVER SECTION --------------------------

// Driver Homepage
app.get("/driver", (req, res) => {
    res.render("./driver/home.hbs");
});

// Driver Dashboard Page
app.get("/driver/dashboard", (req, res) => {
    res.render("./driver/dashboard.hbs");
});

// Driver Delivery Page
app.get("/driver/deliver", (req, res) => {
    res.render("./driver/deliver.hbs");
});

// Driver Login Page
app.get("/driver/login", (req, res) => {
    res.render("./driver/login.hbs");
});

// Driver Orders Page
app.get("/driver/orders", (req, res) => {
    res.render("./driver/orders.hbs");
});

// Driver Registration Page
app.get("/driver/register", (req, res) => {
    res.render("./driver/register.hbs");
});



// --------------------- SERVER AND MONGODB ------------------------
const startServer = async () => {
    console.log(`The server is running on http://localhost:${port}`)
    console.log(`Press CTRL + C to exit`)

    // MongoDB Connection
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Success! Connected to MongoDB")
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
app.listen(port, startServer)