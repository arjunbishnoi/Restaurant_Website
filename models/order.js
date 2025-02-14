const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        price: { type: Number, required: true }
    }],
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["READY", "IN TRANSIT", "DELIVERED"], default: "READY" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
    deliveryProof: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);