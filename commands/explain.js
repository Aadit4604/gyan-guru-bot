const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { explainTopic } = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('explain')
        .setDescription('Get a clear explanation of a topic')
        .addStringOption(option => 
            option.setName('topic')
            .setDescription('The topic to explain')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const topic = interaction.options.getString('topic');
        
        const explanation = await explainTopic(topic, interaction.user.id);
        
        const embed = new EmbedBuilder()
            .setTitle(`📚 Explanation: ${topic}`)
            .setDescription(explanation)
            .setColor(0x3B82F6)
            .setFooter({ text: 'Powered by Padh Lo AI' });

        await interaction.editReply({ embeds: [embed] });
    },
};