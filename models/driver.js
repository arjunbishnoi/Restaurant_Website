// REQUIRED: uses the mongoose library
const mongoose = require("mongoose");


// SCHEMA: data structure that represents ONE document in your collection
// Specifies the properties of an item & the data types of each property
const driverSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    vehicleModel: String,
    licensePlate: String
  }, { timestamps: true });

// - If the collection does not exist, then create it
// - Otherwise, use the existing collection
module.exports = mongoose.model('Driver', driverSchema);