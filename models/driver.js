const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema for the Driver model
const driverSchema = new mongoose.Schema({
  // Username for driver login (unique and required)
  username: { 
    type: String, 
    required: [true, "Username is required"], 
    unique: true,
    trim: true, // Removes whitespace
    index: true // Improves query performance
  },
  
  // Password (securely hashed before saving)
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  
  // Full name of the driver
  driverName: {
    type: String,
    required: [true, "Driver name is required"],
    trim: true
  },
  
  // Vehicle model (e.g., Toyota Corolla)
  vehicleModel: {
    type: String,
    required: [true, "Vehicle model is required"]
  },
  
  // License plate (uppercase alphanumeric, 6-8 characters)
  licensePlate: {
    type: String,
    required: [true, "License plate is required"],
    uppercase: true, // Ensures the value is stored in uppercase
    match: [/^[A-Z0-9]{6,8}$/, "License plate must be 6-8 alphanumeric characters (uppercase only)"]
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Middleware to hash the password before saving
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

// Method to compare entered password with the hashed password
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

// Export the Driver model
const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;