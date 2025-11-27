const fs = require('fs');
const path = require('path');
const { generateQuestion } = require('./ai');

const questionsPath = path.join(__dirname, '../data/questions.json');

function getQuestions() {
    try {
        const data = fs.readFileSync(questionsPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveQuestions(questions) {
    fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
}

module.exports = {
    getRandomQuestion: async (chapter = null, userId = 'system') => {
        try {
            // 70% chance to use AI-generated question, 30% chance to use static questions
            const useAI = Math.random() < 0.7;

            if (useAI) {
                const aiQuestion = await generateQuestion(chapter, userId);
                if (aiQuestion) {
                    return aiQuestion;
                }
            }

            // Fallback to static questions if AI fails
            const questions = getQuestions();
            let filtered = questions;
            if (chapter) {
                filtered = questions.filter(q => q.chapter.toLowerCase() === chapter.toLowerCase());
            }
            if (filtered.length === 0) return null;
            return filtered[Math.floor(Math.random() * filtered.length)];
        } catch (error) {
            console.error('Error in getRandomQuestion:', error);
            // Fallback to static questions on error
            const questions = getQuestions();
            let filtered = questions;
            if (chapter) {
                filtered = questions.filter(q => q.chapter.toLowerCase() === chapter.toLowerCase());
            }
            if (filtered.length === 0) return null;
            return filtered[Math.floor(Math.random() * filtered.length)];
        }
    },

    addQuestion: (newQuestion) => {
        const questions = getQuestions();
        newQuestion.id = `q${questions.length + 1}`;
        questions.push(newQuestion);
        saveQuestions(questions);
        return newQuestion;
    },

    getQuestionById: (id) => {
        const questions = getQuestions();
        return questions.find(q => q.id === id);
    }
};