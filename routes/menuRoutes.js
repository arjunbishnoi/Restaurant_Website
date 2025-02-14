const express = require("express");
const router = express.Router();
const MenuItem = require("../models/menuItem");
const Order = require("../models/order");

// API Route: Fetch menu items
router.get("/api", async (req, res) => {
    try {
        return res.json(await MenuItem.find());
    } catch {
        return res.json([]);
    }
});

// Page Route: Render menu page
router.get("/", async (req, res) => {
    try {
        return res.render("menu/menu", { menuItems: await MenuItem.find() });
    } catch {
        return res.render("menu/menu", { menuItems: [] });
    }
});

// Placing an Order
router.post("/order", async (req, res) => {
    try {
        return res.json(await new Order(req.body).save());
    } catch {
        return res.json({ error: "Failed to place order" });
    }
});

// Order Status
router.get("/order/:id", async (req, res) => {
    try {
        return res.json(await Order.findById(req.params.id));
    } catch {
        return res.json({ error: "Order not found" });
    }
});

module.exports = router;
