
const express = require('express');
const router = express.Router();
const { rateLimiter, getUserData } = require('../middleware/rateLimiter');

router.post('/chat', rateLimiter, async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required.' });

    try {
        // If GOOGLE key isn't set, fallback to mock
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            const aiResponse = `Mock AI response to: "${message}" (no Gemini key set)`;
            return res.status(200).json({ success: true, message: aiResponse, remaining_requests: req.remainingRequests });
        }

        // Dynamically import for lightweight module loading
        const { generateText } = await import('ai');
        const { google } = await import('@ai-sdk/google');

        // Choose your Gemini model
        const model = google('gemini-2.5-flash');

        // Call Gemini
        const result = await generateText({
            model,
            prompt: message,
        });

        return res.status(200).json({ success: true, message: result.text, remaining_requests: req.remainingRequests });
    } catch (err) {
        console.error('Gemini SDK error:', err.message);
        return res.status(500).json({ success: false, error: 'AI request failed.' });
    }
});

// GET /api/status
router.get('/status', (req, res) => {
    const { userType, limit, userData, secondsUntilReset } = getUserData(req);
    const remaining = Math.max(0, limit - userData.count);

    res.status(200).json({
        success: true,
        userType,
        total_requests_per_hour: limit,
        remaining_requests: remaining,
        reset_in_seconds: secondsUntilReset,
    });
});

module.exports = router;
