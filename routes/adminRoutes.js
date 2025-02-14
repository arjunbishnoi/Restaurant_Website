const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
    res.send('Admin website homepage');
});

module.exports = router;