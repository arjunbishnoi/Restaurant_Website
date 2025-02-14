const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        deliveryAddress: {
            type: String,
            required: true,
            trim: true,
        },
        items: [
            {
                itemName: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, default: 1 },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
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
    },
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;
