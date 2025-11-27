/**
 * Rate Limiting System for API calls
 * Prevents spam and API quota exhaustion
 */

const rateLimits = new Map();

const CONFIG = {
    GLOBAL_LIMIT: 60,           // Max requests per minute globally (Gemini free tier limit)
    USER_LIMIT: 4,              // Max requests per minute per user (Gemini free tier limit)
    COOLDOWN_MINUTES: 1,        // Cooldown period in minutes
    WARNING_THRESHOLD: 0.75     // Show warning at 75% usage
};

/**
 * Check if user has exceeded rate limit
 * @param {string} userId - Discord user ID
 * @returns {object} { allowed: boolean, remaining: number, resetIn: number, isWarning: boolean }
 */
function checkRateLimit(userId) {
    const now = Date.now();
    const cooldownMs = CONFIG.COOLDOWN_MINUTES * 60 * 1000;
    
    if (!rateLimits.has(userId)) {
        rateLimits.set(userId, { count: 0, resetTime: now + cooldownMs });
    }

    const userLimit = rateLimits.get(userId);

    // Reset if cooldown expired
    if (now > userLimit.resetTime) {
        userLimit.count = 0;
        userLimit.resetTime = now + cooldownMs;
    }

    userLimit.count++;

    const remaining = Math.max(0, CONFIG.USER_LIMIT - userLimit.count);
    const resetIn = Math.ceil((userLimit.resetTime - now) / 1000);
    const isWarning = userLimit.count >= CONFIG.USER_LIMIT * CONFIG.WARNING_THRESHOLD;
    const allowed = userLimit.count <= CONFIG.USER_LIMIT;

    return {
        allowed,
        remaining,
        resetIn,
        isWarning,
        count: userLimit.count,
        limit: CONFIG.USER_LIMIT
    };
}

/**
 * Clean up old entries (call periodically)
 */
function cleanup() {
    const now = Date.now();
    for (const [userId, data] of rateLimits.entries()) {
        if (now > data.resetTime + 300000) { // Remove entries older than 5 minutes
            rateLimits.delete(userId);
        }
    }
}

// Cleanup every 5 minutes
setInterval(cleanup, 5 * 60 * 1000);

module.exports = {
    checkRateLimit,
    CONFIG
};
