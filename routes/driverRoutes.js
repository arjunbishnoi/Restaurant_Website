const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Driver = require('../models/driver');

// Middleware to check if the driver is logged in
const requireDriverAuth = (req, res, next) => {
    if (!req.session.driverId) {
        return res.redirect('/driver/login');
    }
    next();
};

// Driver Homepage
router.get('/', (req, res) => {
    res.render('./driver/home.hbs', { session: req.session });
});

// Driver Registration Page
router.get('/register', (req, res) => {
    res.render('./driver/register.hbs', { error: null });
});

// Driver Registration Logic
router.post('/register', async (req, res) => {
    try {
        const { username, password, driverName, vehicleModel, licensePlate } = req.body;

        // Check if the username already exists
        const existingDriver = await Driver.findOne({ username });
        if (existingDriver) {
            return res.render('./driver/register.hbs', { error: 'Username already exists' });
        }

        // Create a new driver
        const newDriver = new Driver({
            username,
            password,
            driverName,
            vehicleModel,
            licensePlate,
        });
        await newDriver.save();

        res.redirect('/driver/login');
    } catch (err) {
        console.error(err);
        res.status(400).render('./driver/register.hbs', { error: 'Registration failed' });
    }
});

// Driver Login Page
router.get('/login', (req, res) => {
    res.render('./driver/login.hbs', { error: null });
});

// Driver Login Logic
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const driver = await Driver.findOne({ username });

        if (!driver || !(await driver.comparePassword(password))) {
            return res.render('./driver/login.hbs', { error: 'Invalid credentials' });
        }

        req.session.driverId = driver._id;
        req.session.driverName = driver.driverName;
        res.redirect('/driver/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Login failed' });
    }
});

// Driver Dashboard
router.get('/dashboard', requireDriverAuth, async (req, res) => {
    try {
        const orders = await Order.find({
            driver: req.session.driverId,
            status: 'IN TRANSIT',
        }).populate('driver');
        res.render('./driver/dashboard.hbs', {
            driver: req.session.driverName,
            orders,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Failed to load dashboard' });
    }
});

// Available Orders
router.get('/orders', requireDriverAuth, async (req, res) => {
    try {
        const availableOrders = await Order.find({ status: 'READY' });
        res.render('./driver/orders.hbs', { orders: availableOrders });
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Failed to load orders' });
    }
});

// Claim an Order
router.post('/orders/claim/:orderId', requireDriverAuth, async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.orderId, status: 'READY' },
            { status: 'IN TRANSIT', driver: req.session.driverId },
            { new: true }
        );

        if (!order) {
            return res.status(404).render('error.hbs', { message: 'Order no longer available' });
        }

        res.redirect('/driver/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Failed to claim order' });
    }
});

// Deliver an Order
router.post('/deliver/:orderId', requireDriverAuth, async (req, res) => {
    try {
        if (!req.files || !req.files.deliveryProof) {
            return res.status(400).render('error.hbs', { message: 'Proof image required' });
        }

        const proofImage = req.files.deliveryProof;
        const fileName = `delivery-${Date.now()}-${proofImage.name}`;
        const writeStream = mongoose.connection.db.bucket().openUploadStream(fileName);
        writeStream.end(proofImage.data);

        await Order.findByIdAndUpdate(req.params.orderId, {
            status: 'DELIVERED',
            deliveryProof: fileName,
        });

        res.redirect('/driver/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Delivery confirmation failed' });
    }
});

// Driver Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/driver/login');
    });
});

module.exports = router;