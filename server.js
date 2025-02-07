const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 8080

const app = express()

app.engine('hbs', exphbs.engine({
        extname: 'hbs',             // File extension
        defaultLayout: false }));   // Disable default layout
app.set('view engine', 'hbs');  // Set Handlebars as the template engine
app.set('views', './views');    // Specify views directory

// tells express that this application will contain
// endpoints that receives data from a form
app.use(express.urlencoded({ extended: true }))

// Additional variables and definitions


// HOME PAGE
app.get("/", (req, res) => {
    return res.render("home.hbs")
})


// section 1 - Admin Page
app.get("/admin", (req, res) => {
    return res.render("./admin/admin.hbs")
})


// section 2 - Delivery Driver Page
app.get("/deliver", (req, res) => {
    return res.render("./deliver/deliver.hbs")
})


// section 3 - Menu Page
app.get("/menu", (req, res) => {
    return res.render("./menu/menu.hbs")
})


// Starting Server
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