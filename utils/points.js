const fs = require('fs');
const path = require('path');

const scoresPath = path.join(__dirname, '../data/scores.json');

// Ensure data file exists
function ensureDataFile() {
    if (!fs.existsSync(scoresPath)) {
        fs.writeFileSync(scoresPath, JSON.stringify({}, null, 2));
    }
}

// Helper to read scores with error handling
function getScores() {
    try {
        ensureDataFile();
        const data = fs.readFileSync(scoresPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading scores:', err);
        return {};
    }
}

// Helper to save scores with error handling
function saveScores(scores) {
    try {
        ensureDataFile();
        fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
    } catch (err) {
        console.error('Error saving scores:', err);
    }
}

/**
 * Initialize a new user profile
 */
function initializeUser(userId) {
    return {
        points: 0,
        streak: 0,
        lastDaily: null,
        questsCompleted: 0,
        joinedAt: new Date().toISOString()
    };
}

module.exports = {
    /**
     * Add points to a user
     */
    addPoints: (userId, points) => {
        if (!userId || points < 0) return 0;
        
        const scores = getScores();
        if (!scores[userId]) {
            scores[userId] = initializeUser(userId);
        }
        
        scores[userId].points += Math.floor(points);
        saveScores(scores);
        return scores[userId].points;
    },

    /**
     * Remove points from a user
     */
    removePoints: (userId, points) => {
        if (!userId || points < 0) return 0;
        
        const scores = getScores();
        if (scores[userId]) {
            scores[userId].points = Math.max(0, scores[userId].points - Math.floor(points));
            saveScores(scores);
            return scores[userId].points;
        }
        return 0;
    },

    /**
     * Get user stats
     */
    getStats: (userId) => {
        if (!userId) return initializeUser('unknown');
        
        const scores = getScores();
        return scores[userId] || initializeUser(userId);
    },

    /**
     * Update user streak and award bonus
     */
    updateStreak: (userId) => {
        if (!userId) return 0;
        
        const scores = getScores();
        if (!scores[userId]) {
            scores[userId] = initializeUser(userId);
        }
        
        const today = new Date().toDateString();
        const lastDaily = scores[userId].lastDaily;
        
        // Check if already claimed today
        if (lastDaily === today) {
            return { claimed: false, streak: scores[userId].streak, message: '📅 You already claimed your daily bonus today!' };
        }
        
        // Check if streak is broken (missed more than 1 day)
        if (lastDaily) {
            const lastDate = new Date(lastDaily);
            const today_date = new Date();
            const dayDiff = Math.floor((today_date - lastDate) / (1000 * 60 * 60 * 24));
            
            if (dayDiff > 1) {
                scores[userId].streak = 1; // Reset streak
            } else {
                scores[userId].streak += 1;
            }
        } else {
            scores[userId].streak = 1;
        }
        
        scores[userId].lastDaily = today;
        scores[userId].questsCompleted += 1;
        scores[userId].points += 20; // Base daily reward
        
        // Streak bonus
        const streakBonus = Math.min(scores[userId].streak * 5, 50); // Max 50 bonus
        scores[userId].points += streakBonus;
        
        saveScores(scores);
        
        return {
            claimed: true,
            streak: scores[userId].streak,
            pointsEarned: 20 + streakBonus,
            message: `✨ Daily bonus claimed! +${20 + streakBonus} gyan gola (Streak: ${scores[userId].streak})`
        };
    },

    /**
     * Get top 10 leaderboard
     */
    getLeaderboard: () => {
        const scores = getScores();
        return Object.entries(scores)
            .map(([userId, stats]) => ({
                userId,
                points: stats.points,
                streak: stats.streak
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);
    },

    /**
     * Get user rank
     */
    getUserRank: (userId) => {
        const leaderboard = module.exports.getLeaderboard();
        const rank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
        return rank > 0 ? rank : null;
    },

    /**
     * Get all users count
     */
    getTotalUsers: () => {
        return Object.keys(getScores()).length;
    }
};