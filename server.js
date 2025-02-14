// ------------------------- REQUIREMENTS --------------------------
// Dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
require('dotenv').config();

// App Defined
const app = express();
const port = process.env.PORT || 8080;

// Handlebars Setup
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: false }));
app.set('view engine', 'hbs');
app.use(express.static('public'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_default_secret_for_development',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(fileUpload());
app.use(morgan('dev'));

// ------------------------- HOME PAGE ----------------------------
app.get("/", (req, res) => res.render("home"));

// ----------------------- ROUTES SECTION ---------------------------
// Routes
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driverRoutes = require('./routes/driverRoutes');
app.use('/menu', menuRoutes);
app.use('/admin', adminRoutes);
app.use('/driver', driverRoutes);

// --------------------- SERVER AND MONGODB ------------------------
// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).render('error', { message: 'Something went wrong!' }); // Render the error page
});

// MongoDB Connection and Server Start
const startServer = async () => {
    try {
        // Connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully.");

        // Start the server after successfully connecting to MongoDB
        app.listen(port, () => {
            console.log(`The server is running on http://localhost:${port}`);
            console.log(`Press CTRL + C to exit`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if connection fails
    }
};

// Call the startServer function to initialize the application
startServer();