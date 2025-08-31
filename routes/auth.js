// routes/auth.js

const express = require('express');
const router = express.Router();

// Helper function to generate a simple token using Buffer
function generateToken(userId, userType) {
    return Buffer.from(JSON.stringify({ id: userId, type: userType })).toString('base64');
}

// POST /api/login - Get user token
router.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, error: 'Username is required.' });
    }

    let userType = 'free';
    if (username === 'premiumuser') {
        userType = 'premium';
    } else if (username === 'guestuser') {
        userType = 'guest';
    }

    const token = generateToken(username, userType);

    res.status(200).json({ success: true, message: 'Login successful.', token: token, userType: userType });
});

module.exports = router;