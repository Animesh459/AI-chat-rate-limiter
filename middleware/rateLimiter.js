// middleware/rateLimiter.js

const userLimits = {
    guest: 3, // 3 AI questions per hour
    free: 10, // 10 AI questions per hour
    premium: 50, // 50 AI questions per hour
};

// In-memory storage for user usage
const requestCounts = {};

// Helper function to decode a token
function decodeToken(token) {
    try {
        return JSON.parse(atob(token));
    } catch (e) {
        return null;
    }
}

// **CORRECTED AND SIMPLIFIED** Helper function
const getUserData = (req) => {
    let userId;
    let userType;

    // Check for a valid token first
    const token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        const decoded = decodeToken(token.split(' ')[1]);
        if (decoded) {
            // A valid token was found, use its data
            userId = decoded.id;
            userType = decoded.type;
        }
    }

    // If no valid token was found, default to guest
    if (!userId) {
        userId = req.ip;
        userType = 'guest';
    }

    const limit = userLimits[userType];

    if (!requestCounts[userId]) {
        requestCounts[userId] = {
            count: 0,
            lastResetTime: Date.now()
        };
    }

    const userData = requestCounts[userId];
    const currentTime = Date.now();
    const oneHourInMs = 60 * 60 * 1000;

    // Fixed Window logic: reset the counter if the window has expired
    if (currentTime - userData.lastResetTime >= oneHourInMs) {
        userData.count = 0;
        userData.lastResetTime = currentTime;
    }

    return { userId, userType, limit, userData };
};

// Rate Limiter Middleware
const rateLimiter = (req, res, next) => {
    const { userType, limit, userData } = getUserData(req);

    // Check if the user has exceeded their limit
    if (userData.count >= limit) {
        const errorMsg = `Too many requests. ${userType.charAt(0).toUpperCase() + userType.slice(1)} users can make ${limit} requests per hour.`;
        return res.status(429).json({
            success: false,
            error: errorMsg,
            remaining_requests: 0
        });
    }

    // If not exceeded, increment the count
    userData.count++;
    req.remainingRequests = limit - userData.count;
    next();
};

module.exports = { rateLimiter, getUserData };