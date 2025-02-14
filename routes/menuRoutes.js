const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuItem");
const Order = require("../models/order");

// Fetch all menu items
router.get("/menu", async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        return res.json(menuItems);
    } catch (err) {
        return res.json({ error: "Failed to fetch menu" });
    }
});

// Place an order
router.post("/order", async (req, res) => {
    try {
        const { customerName, deliveryAddress, items } = req.body;
        const newOrder = new Order({ customerName, deliveryAddress, items });
        const savedOrder = await newOrder.save();
        return res.json({ orderId: savedOrder._id, message: "Order placed successfully!" });
    } catch (err) {
        return res.json({ error: "Failed to place order" });
    }
});

// Get order status
router.get("/order/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.json({ error: "Order not found" });
        return res.json({ status: order.status });
    } catch (err) {
        return res.json({ error: "Error fetching order status" });
    }
});