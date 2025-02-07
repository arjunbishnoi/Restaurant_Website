const express = require("express")
const app = express()
const port = process.env.PORT || 8080

// tells express to use EJS
app.set("view engine", "ejs")

// tells express that this application will contain
// endpoints that receives data from a form
app.use(express.urlencoded({ extended: true }))

// http://localhost:8080/
app.get("/", (req, res) => {
    return res.render("home.ejs")
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

