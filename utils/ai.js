const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini with 6 API keys for load balancing
const apiKey1 = process.env.API_KEY_1;
const apiKey2 = process.env.API_KEY_2;
const apiKey3 = process.env.API_KEY_3;
const apiKey4 = process.env.API_KEY_4;
const apiKey5 = process.env.API_KEY_5;
const apiKey6 = process.env.API_KEY_6;

if (!apiKey1) {
    console.warn('⚠️ WARNING: API_KEY_1 not found in environment variables');
}

const ai1 = apiKey1 ? new GoogleGenAI({ apiKey: apiKey1 }) : null;
const ai2 = apiKey2 ? new GoogleGenAI({ apiKey: apiKey2 }) : null;
const ai3 = apiKey3 ? new GoogleGenAI({ apiKey: apiKey3 }) : null;
const ai4 = apiKey4 ? new GoogleGenAI({ apiKey: apiKey4 }) : null;
const ai5 = apiKey5 ? new GoogleGenAI({ apiKey: apiKey5 }) : null;
const ai6 = apiKey6 ? new GoogleGenAI({ apiKey: apiKey6 }) : null;

// Available AI instances
const aiInstances = [ai1, ai2, ai3, ai4, ai5, ai6].filter(ai => ai !== null);

// Round-robin load balancing
let requestCount = 0;

function getNextAI() {
    if (aiInstances.length === 0) {
        throw new Error('No API keys configured');
    }
    requestCount++;
    return aiInstances[(requestCount - 1) % aiInstances.length];
}

/**
 * Explain a topic with detailed breakdown
 * @param {string} topic - Topic to explain
 * @param {string} userId - Discord user ID for logging
 * @returns {Promise<string>} Explanation text
 */
async function explainTopic(topic, userId) {
    if (!topic || topic.trim().length === 0) {
        return '❌ Please provide a topic to explain!';
    }

    if (topic.length > 200) {
        return '❌ Topic is too long! Please keep it under 200 characters.';
    }

    try {
        const ai = getNextAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert Grade 10 CBSE tutor. Explain this topic concisely:
            
Topic: "${topic}"

Guidelines:
- Use clear headings and bullet points
- Include key concepts and definitions
- Add one real-world example
- Format for Discord markdown
- Keep it concise (under 1500 characters)
- Use emojis sparingly for clarity`
        });
        
        if (!response.text) {
            return '❌ No response received from AI. Please try again.';
        }
        
        return response.text;
    } catch (error) {
        console.error(`❌ AI Error for user ${userId}:`, error.message);
        
        if (error.message.includes('API key')) {
            return '❌ API key error. Please contact the bot administrator.';
        }
        
        if (error.message.includes('quota')) {
            return '⚠️ API quota exceeded. Please try again later.';
        }
        
        return `❌ Error: ${error.message || 'Failed to generate explanation. Please try again.'}`;
    }
}

/**
 * Answer a question from a user
 * @param {string} question - Question to answer
 * @param {string} userId - Discord user ID for logging
 * @returns {Promise<string>} Answer text
 */
async function askQuestion(question, userId) {
    if (!question || question.trim().length === 0) {
        return '❌ Please ask a question!';
    }

    if (question.length > 300) {
        return '❌ Question is too long! Please keep it under 300 characters.';
    }

    try {
        const ai = getNextAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful study assistant for Grade 10 CBSE students.

Answer this question step-by-step:
"${question}"

Guidelines:
- Be concise and clear
- Use numbered steps if applicable
- Explain concepts in simple terms
- Format for Discord markdown
- Keep it under 2000 characters if possible`
        });
        
        if (!response.text) {
            return '❌ No response received from AI. Please try again.';
        }
        
        return response.text;
    } catch (error) {
        console.error(`❌ AI Error for user ${userId}:`, error.message);
        
        if (error.message.includes('API key')) {
            return '❌ API key error. Please contact the bot administrator.';
        }
        
        if (error.message.includes('quota')) {
            return '⚠️ API quota exceeded. Please try again later.';
        }
        
        return `❌ Error: ${error.message || 'Failed to answer question. Please try again.'}`;
    }
}

/**
 * Generate a random Grade 10 CBSE question
 * @param {string} chapter - Optional: specific chapter to generate question from
 * @param {string} userId - Discord user ID for logging
 * @returns {Promise<Object>} Question object with id, chapter, subject, question, options, correctAnswer, hint, difficulty
 */
async function generateQuestion(chapter = null, userId = 'system') {
    const chapters = [
        // Science Chapters
        'Chemical Reactions and Equations',
        'Acids, Bases and Salts',
        'Metals and Non-metals',
        'Carbon and its Compounds',
        'Periodic Classification of Elements',
        'Life Processes',
        'Control and Coordination',
        'How do Organisms Reproduce',
        'Heredity and Evolution',
        'Light - Reflection and Refraction',
        'The Human Eye and Colourful World',
        'Electricity',
        'Magnetic Effects of Electric Current',
        'Sources of Energy',
        'Our Environment',
        // Math Chapters
        'Real Numbers',
        'Polynomials',
        'Pair of Linear Equations in Two Variables',
        'Quadratic Equations',
        'Arithmetic Progressions',
        'Triangles',
        'Coordinate Geometry',
        'Introduction to Trigonometry',
        'Some Applications of Trigonometry',
        'Circles',
        'Areas Related to Circles',
        'Surface Areas and Volumes',
        'Statistics',
        'Probability',
        // History Chapters
        'The Rise of Nationalism in Europe',
        'Nationalism in India',
        'The Making of a Global World',
        'The Age of Industrialisation'
    ];

    const selectedChapter = chapter || chapters[Math.floor(Math.random() * chapters.length)];
    const subjects = ['Science', 'Math', 'History'];
    const subject = chapters.slice(0, 15).includes(selectedChapter) ? 'Science' : 
                   chapters.slice(15, 30).includes(selectedChapter) ? 'Math' : 'History';

    try {
        const ai = getNextAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert Grade 10 CBSE question setter. Generate a single multiple choice question from the following chapter:

Chapter: "${selectedChapter}"
Subject: "${subject}"

IMPORTANT: Respond with ONLY valid JSON in this exact format, no other text:
{
  "chapter": "${selectedChapter}",
  "subject": "${subject}",
  "question": "Your question here?",
  "options": [
    "Option A (correct answer)",
    "Option B (plausible wrong answer)",
    "Option C (plausible wrong answer)", 
    "Option D (plausible wrong answer)"
  ],
  "correctAnswer": 0,
  "hint": "A helpful hint here",
  "difficulty": "Easy"
}

Guidelines:
- correctAnswer must be 0, 1, 2, or 3 (index of correct option)
- Difficulty should be Easy, Medium, or Hard
- Question must be from CBSE Grade 10 curriculum
- Options should be realistic and educational
- Make sure first option is ALWAYS the correct one`
        });
        
        if (!response.text) {
            return null;
        }

        // Parse the JSON response - handle markdown code blocks
        let jsonText = response.text.trim();
        
        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Parse the cleaned JSON
        let questionData = JSON.parse(jsonText);
        questionData.id = `generated_${Date.now()}`;
        return questionData;

    } catch (error) {
        console.error(`❌ Question Generation Error for user ${userId}:`, error.message);
        return null;
    }
}

module.exports = {
    explainTopic,
    askQuestion,
    generateQuestion
};