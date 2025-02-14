// -------------------------------
// DRIVER MODEL (MongoDB Schema)
// Handles delivery driver accounts
// Includes secure password hashing and validation
// -------------------------------
// 1. LIBRARY IMPORTS
const mongoose = require("mongoose"); // MongoDB ORM
const bcrypt = require("bcrypt");     // Password hashing

// 2. SCHEMA DEFINITION
const driverSchema = new mongoose.Schema({
  // Unique username for driver login
  username: { 
    type: String, 
    required: [true, "Username is required"], // Custom error message
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
    match: [/^[A-Z0-9]{6,8}$/, "License plate must be 6-8 alphanumeric characters"]
  }
}, { 
  timestamps: true // Auto-add createdAt/updatedAt fields
});

// 3. PASSWORD HASHING MIDDLEWARE
// Hashes password before saving to DB
driverSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 4. PASSWORD COMPARISON METHOD
// Used during login to validate credentials
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

// 5. MODEL EXPORT
const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;