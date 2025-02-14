// -------------------------------
// DRIVER MODEL (MongoDB Schema)
// Handles delivery driver accounts
// Includes secure password hashing and validation
// -------------------------------
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema Definition
const driverSchema = new mongoose.Schema({
  // Unique username for driver login
  username: { 
    type: String, 
    required: [true, "Username is required"], 
    unique: true,
    trim: true, // Removes whitespace
    index: true // Add index for faster lookups
  },
  
  // Securely hashed password
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  
  // Driver's full name
  driverName: {
    type: String,
    required: [true, "Driver name is required"],
    trim: true
  },
  
  // Vehicle information
  vehicleModel: {
    type: String,
    required: [true, "Vehicle model is required"]
  },
  
  licensePlate: {
    type: String,
    required: [true, "License plate is required"],
    uppercase: true, // Store as uppercase
    match: [/^[A-Z0-9]{6,8}$/, "License plate must be 6-8 alphanumeric characters (uppercase only)"]
  }
}, { 
  timestamps: true // Auto-add createdAt/updatedAt fields
});

// Password Hashing Middleware
driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password Comparison Method
driverSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    return isMatch;
  } catch (err) {
    throw new Error(`Password comparison failed: ${err.message}`);
  }
};

// Export the Driver Model
const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;