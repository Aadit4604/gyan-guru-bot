const { GoogleGenAI } = require("@google/genai");
const config = require('../config.json');
const { checkRateLimit } = require('./rateLimit');

// Initialize Gemini
// Note: In production, use process.env.API_KEY
const apiKey = process.env.API_KEY || config.apiKey;
const ai = new GoogleGenAI({ apiKey: apiKey });

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