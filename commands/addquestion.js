const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addQuestion } = require('../utils/questionManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addquestion')
        .setDescription('Add a new question to the database')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(opt => opt.setName('subject').setRequired(true).setDescription('Subject'))
        .addStringOption(opt => opt.setName('chapter').setRequired(true).setDescription('Chapter'))
        .addStringOption(opt => opt.setName('question').setRequired(true).setDescription('The Question'))
        .addStringOption(opt => opt.setName('correct').setRequired(true).setDescription('Correct Answer Option'))
        .addStringOption(opt => opt.setName('wrong1').setRequired(true).setDescription('Wrong Option 1'))
        .addStringOption(opt => opt.setName('wrong2').setRequired(true).setDescription('Wrong Option 2'))
        .addStringOption(opt => opt.setName('wrong3').setRequired(true).setDescription('Wrong Option 3'))
        .addStringOption(opt => opt.setName('hint').setRequired(true).setDescription('Hint')),
    async execute(interaction) {
        const newQ = {
            subject: interaction.options.getString('subject'),
            chapter: interaction.options.getString('chapter'),
            question: interaction.options.getString('question'),
            options: [
                interaction.options.getString('correct'),
                interaction.options.getString('wrong1'),
                interaction.options.getString('wrong2'),
                interaction.options.getString('wrong3')
            ],
            correctAnswer: 0,
            hint: interaction.options.getString('hint'),
            difficulty: 'Medium'
        };

        addQuestion(newQ);
        await interaction.reply({ content: `✅ Question added to **${newQ.chapter}**!`, ephemeral: true });
    },
};