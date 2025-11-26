const fs = require('fs');
const path = require('path');

const scoresPath = path.join(__dirname, '../data/scores.json');

// Helper to read scores
function getScores() {
    try {
        const data = fs.readFileSync(scoresPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// Helper to save scores
function saveScores(scores) {
    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));
}

module.exports = {
    addPoints: (userId, points) => {
        const scores = getScores();
        if (!scores[userId]) {
            scores[userId] = { points: 0, streak: 0, lastDaily: null, questsCompleted: 0 };
        }
        scores[userId].points += points;
        saveScores(scores);
        return scores[userId].points;
    },

    removePoints: (userId, points) => {
        const scores = getScores();
        if (scores[userId]) {
            scores[userId].points = Math.max(0, scores[userId].points - points);
            saveScores(scores);
            return scores[userId].points;
        }
        return 0;
    },

    getStats: (userId) => {
        const scores = getScores();
        return scores[userId] || { points: 0, streak: 0, lastDaily: null, questsCompleted: 0 };
    },

    updateStreak: (userId) => {
        const scores = getScores();
        if (!scores[userId]) return 0;
        
        const today = new Date().toDateString();
        if (scores[userId].lastDaily !== today) {
            scores[userId].streak += 1;
            scores[userId].lastDaily = today;
            // Bonus for streak
            scores[userId].points += 5; 
        }
        saveScores(scores);
        return scores[userId].streak;
    },

    getLeaderboard: () => {
        const scores = getScores();
        return Object.entries(scores)
            .sort(([, a], [, b]) => b.points - a.points)
            .slice(0, 10);
    }
};