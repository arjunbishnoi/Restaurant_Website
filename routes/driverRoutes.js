const express = require('express');
const router = express.Router();
const Driver = require('../models/driver'); // Import the Driver model
const Order = require('../models/order'); // Import the Order model

// Middleware to check if the driver is logged in
const requireDriverAuth = (req, res, next) => {
  if (!req.session.driverId) {
    return res.redirect('/driver'); // Redirect to login page if not logged in
  }
  next();
};

// Driver Homepage
router.get('/', (req, res) => {
  if (req.session.driverId) {
    return res.redirect('/driver/dashboard'); // Redirect to dashboard if logged in
  }
  res.render('./driver/home.hbs', { session: req.session, error: null });
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

    // Save the new driver to the database
    await newDriver.save();

    // Redirect to login page after successful registration
    res.redirect('/driver/login');
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(400).render('./driver/register.hbs', { error: 'Registration failed' });
  }
});

// Driver Login Page
router.get('/login', (req, res) => {
  res.render('./driver/home.hbs', { session: req.session, error: null });
});

// Driver Login Logic
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const driver = await Driver.findOne({ username });

    // Check if the driver exists and the password is correct
    if (!driver || !(await driver.comparePassword(password))) {
      return res.render('./driver/home.hbs', { session: req.session, error: 'Invalid credentials' });
    }

    // Set session variables
    req.session.driverId = driver._id;
    req.session.driverName = driver.driverName;

    // Redirect to the dashboard
    res.redirect('/driver/dashboard');
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).render('./driver/home.hbs', { session: req.session, error: 'Login failed' });
  }
});

// Driver Dashboard
router.get('/dashboard', requireDriverAuth, async (req, res) => {
  try {
    const driverName = req.session.driverName;

    // Fetch available orders (status = READY)
    const availableOrders = await Order.find({ status: 'READY' });

    // Fetch picked-up orders (status = IN TRANSIT and assigned to the current driver)
    const pickedUpOrders = await Order.find({
      status: 'IN TRANSIT',
      assignedDriver: req.session.driverId,
    });

    // Render the dashboard with both available and picked-up orders
    res.render('./driver/dashboard.hbs', {
      driver: driverName,
      availableOrders: availableOrders || [],
      pickedUpOrders: pickedUpOrders || [],
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err.message);
    res.status(500).render('error.hbs', { message: 'Failed to load dashboard' });
  }
});

// Assign an Order to a Driver
router.post('/orders/:orderId/assign', requireDriverAuth, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const driverId = req.session.driverId;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).render('error.hbs', { message: 'Order not found' });
    }

    // Update the order status to IN TRANSIT and assign it to the current driver
    order.status = 'IN TRANSIT';
    order.assignedDriver = driverId;
    await order.save();

    // Redirect back to the dashboard
    res.redirect('/driver/dashboard');
  } catch (err) {
    console.error('Error assigning order:', err.message);
    res.status(500).render('error.hbs', { message: 'Failed to assign order' });
  }
});

// Mark Order as Delivered (No File Upload)
router.post('/orders/:orderId/fulfill', requireDriverAuth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).render('error.hbs', { message: 'Order not found' });
    }

    // Ensure the order is assigned to the current driver
    if (order.assignedDriver.toString() !== req.session.driverId) {
      return res.status(403).render('error.hbs', { message: 'You are not authorized to fulfill this order' });
    }

    // Update the order status to DELIVERED
    order.status = 'DELIVERED';
    await order.save();

    // Redirect back to the dashboard
    res.redirect('/driver/dashboard');
  } catch (err) {
    console.error('Error fulfilling order:', err.message);
    res.status(500).render('error.hbs', { message: 'Failed to fulfill order' });
  }
});

// Driver Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/driver'); // Redirect to login page after logout
  });
});

module.exports = router;