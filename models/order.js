const mongoose = require('mongoose');

// Define the Order Schema
const orderSchema = new mongoose.Schema({
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
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  deliveryProof: {
    type: String,
  },
}, { timestamps: true });

// Export the Order Model
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;