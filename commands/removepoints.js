const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removePoints } = require('../utils/points');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepoints')
        .setDescription('Deduct points from a user (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(opt => opt.setName('user').setRequired(true).setDescription('Target User'))
        .addIntegerOption(opt => opt.setName('amount').setRequired(true).setDescription('Amount to remove')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        
        const newScore = removePoints(user.id, amount);
        await interaction.reply({ content: `📉 Deducted ${amount} points from ${user}. New Score: ${newScore}`, ephemeral: true });
    },
};