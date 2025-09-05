// middleware/rateLimiter.js
const userLimits = {
    guest: 3,
    free: 10,
    premium: 50,
};

// in-memory usage store (simple fixed-window)
const requestCounts = {};

// decode base64 token -> JSON (Node-friendly)
function decodeToken(token) {
    try {
        const json = Buffer.from(token, 'base64').toString('utf8');
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

const ONE_HOUR_MS = 60 * 60 * 1000;

function getUserData(req) {
    let userId;
    let userType;

    const header = req.headers['authorization'];
    if (header && header.startsWith('Bearer ')) {
        const decoded = decodeToken(header.split(' ')[1]);
        if (decoded && decoded.id) {
            userId = decoded.id;
            userType = decoded.type || 'free';
        }
    }

    // fallback to IP for guests
    if (!userId) {
        userId = req.ip || req.connection?.remoteAddress || 'unknown';
        userType = 'guest';
    }

    const limit = userLimits[userType] ?? userLimits.free;

    if (!requestCounts[userId]) {
        requestCounts[userId] = { count: 0, lastResetTime: Date.now() };
    }

    const userData = requestCounts[userId];
    const now = Date.now();

    // Fixed window: reset if > 1 hour since lastResetTime
    if (now - userData.lastResetTime >= ONE_HOUR_MS) {
        userData.count = 0;
        userData.lastResetTime = now;
    }

    const secondsUntilReset = Math.max(
        0,
        Math.ceil((userData.lastResetTime + ONE_HOUR_MS - now) / 1000)
    );

    return { userId, userType, limit, userData, secondsUntilReset };
}

function rateLimiter(req, res, next) {
    const { userType, limit, userData, secondsUntilReset } = getUserData(req);

    if (userData.count >= limit) {
        return res.status(429).json({
            success: false,
            error: `${userType.charAt(0).toUpperCase() + userType.slice(1)} users can make ${limit} requests per hour.`,
            remaining_requests: 0,
            reset_in_seconds: secondsUntilReset,
        });
    }

    // allowed — increment BEFORE continuing to ensure check happens before AI call
    userData.count++;
    req.remainingRequests = Math.max(0, limit - userData.count);
    req.rateLimit = { userType, limit, reset_in_seconds: secondsUntilReset };
    next();
}

module.exports = { rateLimiter, getUserData, _requestCounts: requestCounts };
