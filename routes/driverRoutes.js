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
    res.render('./driver/home.hbs');
});
// Driver dashboard
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
        res.status(500).render('error.hbs', { message: 'Server error' });
    }
});

// Available orders
router.get('/orders', requireDriverAuth, async (req, res) => {
    try {
        const availableOrders = await Order.find({ status: 'READY' });
        res.render('./driver/orders.hbs', { orders: availableOrders });
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Failed to load orders' });
    }
});

// Claim an order
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

// Deliver an order
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

// Driver registration
router.post('/register', async (req, res) => {
    try {
        const newDriver = new Driver({
            username: req.body.username,
            password: req.body.password,
            driverName: req.body.driverName,
            vehicleModel: req.body.vehicleModel,
            licensePlate: req.body.licensePlate,
        });
        await newDriver.save();
        res.redirect('/driver/login');
    } catch (err) {
        console.error(err);
        res.status(400).render('./driver/register.hbs', { error: 'Registration failed' });
    }
});

// Driver login
router.post('/login', async (req, res) => {
    try {
        const driver = await Driver.findOne({ username: req.body.username });
        if (!driver || !(await driver.comparePassword(req.body.password))) {
            return res.status(401).render('./driver/login.hbs', { error: 'Invalid credentials' });
        }
        req.session.driverId = driver._id;
        req.session.driverName = driver.driverName;
        res.redirect('/driver/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).render('error.hbs', { message: 'Login failed' });
    }
});

// Driver logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/driver/login');
    });
});

module.exports = router;