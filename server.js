const express = require("express")
const app = express()
const port = process.env.PORT || 8080

// tells express to use EJS
app.set("view engine", "ejs")

// tells express that this application will contain
// endpoints that receives data from a form
app.use(express.urlencoded({ extended: true }))

// database
const mongoose = require("mongoose");
require("dotenv").config();

const Test = require("./models/project_test.js")

// http://localhost:8080/
app.get("/", (req, res) => {
    return res.render("home.ejs")
})

app.get("/insert", (req, res) => {
    return res.render("addform.ejs")
})

app.post("/receivedata", async (req, res) => {
    console.log("DEBUG: Data from form fields")
    console.log(req.body)

    const result = await Test.create({
        test1: req.body.test1textbox,
        test2: parseFloat(req.body.test2textbox),
        // TODO: Update to use req.body.tutioncheckbox
        test3: false
    })
    console.log(result)
    return res.send(`Student inserted, look for document id: ${result._id}`)

})

// http://localhost:8080/getAll
app.get("/getAll", async (req, res) => {
    const testList = await Test.find()
    console.log("DEBUG:")
    console.log(testList)
    return res.render("all.ejs", { s: testList })
})


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

