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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(fileUpload());
app.use(morgan('dev'));


// ------------------------- HOME PAGE ----------------------------
app.get("/", (req, res) => res.render("home.hbs"));


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
    console.error(err.stack);
    res.status(500).render('error.hbs', { message: 'Something went wrong!' });
});

// MongoDB Connection and Server Start
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Success! Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};
app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
    console.log(`Press CTRL + C to exit`);
});