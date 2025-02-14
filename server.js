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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(fileUpload());
app.use(morgan('dev'));

// ------------------------- HOME PAGE ----------------------------
app.get("/", (req, res) => res.render("homepage"));

// ----------------------- ROUTES SECTION ---------------------------
// Routes
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/driverRoutes');
app.use('/menu', menuRoutes);
app.use('/admin', adminRoutes);
app.use('/driver', driverRoutes);


// --------------------- SERVER AND MONGODB ------------------------

// MongoDB Connection and Server Start
const startServer = async () => {
    console.log(`The server is running on http://localhost:${port}`);
    console.log("Press CTRL + C to exit");

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Success! Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

app.listen(port, startServer);