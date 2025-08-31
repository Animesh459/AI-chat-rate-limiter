// routes/chat.js

const express = require('express');
const router = express.Router();
const { rateLimiter, getUserData } = require('../middleware/rateLimiter');

// POST /api/chat - Send message to AI (rate limited)
router.post('/chat', rateLimiter, async (req, res) => {
    const { message } = req.body;

    // Placeholder for Vercel AI SDK call
    const aiResponse = `AI response to: "${message}"`;

    res.status(200).json({
        success: true,
        message: aiResponse,
        remaining_requests: req.remainingRequests
    });
});

// GET /api/status - Check remaining requests
router.get('/status', (req, res) => {
    const { userType, limit, userData } = getUserData(req);

    // Calculate remaining requests based on current count
    const remaining = limit - userData.count;

    res.status(200).json({
        success: true,
        userType: userType,
        total_requests_per_hour: limit,
        remaining_requests: remaining >= 0 ? remaining : 0,
    });
});

module.exports = router;