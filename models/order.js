const mongoose = require('mongoose');

// Define the Order Schema
const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    items: [
      {
        itemName: String,
        price: Number,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["READY", "IN TRANSIT", "DELIVERED"],
      default: "READY",
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver", // References the Driver model
    },
    proofOfDelivery: {
      type: String, // Base64-encoded image for proof of delivery
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export the Order Model
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;