const { GoogleGenAI } = require("@google/genai");
const config = require('../config.json');
const { checkRateLimit } = require('./rateLimit');

// Initialize Gemini with multiple API keys for load balancing
const apiKey1 = process.env.API_KEY_1 || config.apiKey;
const apiKey2 = process.env.API_KEY_2 || process.env.API_KEY_1 || config.apiKey;

const ai1 = new GoogleGenAI({ apiKey: apiKey1 });
const ai2 = new GoogleGenAI({ apiKey: apiKey2 });

// Round-robin load balancing
let requestCount = 0;

function getNextAI() {
    requestCount++;
    return requestCount % 2 === 0 ? ai1 : ai2;
}

module.exports = {
    explainTopic: async (topic, userId) => {
        // Check rate limit
        const rateLimitStatus = checkRateLimit(userId);
        if (!rateLimitStatus.allowed) {
            return `⚠️ **Rate Limited!**\nYou've used all your AI requests. Please wait ${rateLimitStatus.resetIn} seconds before trying again.`;
        }

        if (rateLimitStatus.isWarning) {
            console.warn(`⚠️ User ${userId} is approaching rate limit (${rateLimitStatus.count}/${rateLimitStatus.limit})`);
        }

        try {
            const ai = getNextAI();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Explain the Grade 10 CBSE topic: "${topic}". 
                Keep it concise, use bullet points, and provide one real-life example. 
                Format correctly for Discord (markdown).`
            });
            return response.text;
        } catch (error) {
            console.error("AI Error:", error);
            return "Sorry, I couldn't fetch an explanation right now. Please check your API key.";
        }
    },

    askQuestion: async (question, userId) => {
        // Check rate limit
        const rateLimitStatus = checkRateLimit(userId);
        if (!rateLimitStatus.allowed) {
            return `⚠️ **Rate Limited!**\nYou've used all your AI requests. Please wait ${rateLimitStatus.resetIn} seconds before trying again.`;
        }

        if (rateLimitStatus.isWarning) {
            console.warn(`⚠️ User ${userId} is approaching rate limit (${rateLimitStatus.count}/${rateLimitStatus.limit})`);
        }

        try {
            const ai = getNextAI();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a helpful study assistant for a Grade 10 student. 
                Answer this question step-by-step: "${question}"`
            });
            return response.text;
        } catch (error) {
            console.error("AI Error:", error);
            return "My brain is fuzzy right now. Try again later!";
        }
    }
};