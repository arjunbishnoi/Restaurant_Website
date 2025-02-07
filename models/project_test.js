// REQUIRED: uses the mongoose library
const mongoose = require("mongoose");


// SCHEMA: data structure that represents ONE document in your collection
// Specifies the properties of a Student & the data types of each property
const testSchema = new mongoose.Schema({
   test1: { type: String },
   test2: { type: Number },
   test3: { type: Boolean},   
}, { timestamps: true });

// MODEL: 
// 1. Creates a data structure that has functions for you to 
// use to manipulate the collection
// .find()
// .findById()
// .findByIdAndUpdate()
// .create()
// .findByIdAndDelete()
// 2. Attempt to create a collection in the database called "Students"
// - If the collection does not exist, then create it
// - Otherwise, use the existing collection
module.exports = mongoose.model("project_test", testSchema);