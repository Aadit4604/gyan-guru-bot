const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and their descriptions'),
    async execute(interaction) {
        const prefix = '/';
        const commandCount = 13;

        const embed = new EmbedBuilder()
            .setTitle('🌙 Gyan Guru Help Menu')
            .setThumbnail(interaction.client.user.avatarURL())
            .setDescription(`${prefix}Prefix for this server is .\n\n${prefix}Total commands: ${commandCount}`)
            .addFields(
                {
                    name: '📚 My Categories are:',
                    value: '⬇️ Click the dropdown below to explore',
                    inline: false
                }
            )
            .setColor(0x5865F2)
            .setFooter({ 
                text: 'This Command Will Be Deactivated After 60sec.',
                iconURL: interaction.client.user.avatarURL()
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Choose a category...')
            .addOptions(
                {
                    label: 'Home',
                    value: 'home',
                    emoji: '🏠',
                    description: 'Back to main menu'
                },
                {
                    label: 'Learning & Explanation',
                    value: 'learning',
                    emoji: '📚',
                    description: 'Ask questions and get explanations'
                },
                {
                    label: 'Practice & Compete',
                    value: 'practice',
                    emoji: '🎮',
                    description: 'Practice, match, quiz, and hints'
                },
                {
                    label: 'Progress & Rewards',
                    value: 'progress',
                    emoji: '📊',
                    description: 'Score, leaderboard, and daily quests'
                },
                {
                    label: 'Admin & Management',
                    value: 'admin',
                    emoji: '⚙️',
                    description: 'Add questions and manage points'
                },
                {
                    label: 'Stats & Info',
                    value: 'stats',
                    emoji: '📈',
                    description: 'Key features and achievements'
                },
                {
                    label: 'Level',
                    value: 'level',
                    emoji: '⬆️',
                    description: 'Leveling system info'
                }
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        try {
            const message = await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        const collector = message.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 60000 // 60 seconds
        });

        const categoryEmbeds = {
            home: new EmbedBuilder()
                .setTitle('🌙 Gyan Guru Help Menu')
                .setDescription(`${prefix}Prefix for this server is .\n\n${prefix}Total commands: ${commandCount}`)
                .addFields({
                    name: '📚 My Categories are:',
                    value: '⬇️ Click the dropdown below to explore',
                    inline: false
                })
                .setColor(0x5865F2)
                .setThumbnail(interaction.client.user.avatarURL()),

            learning: new EmbedBuilder()
                .setTitle('📚 Learning & Explanation')
                .setDescription('Ask questions and get explanations from AI')
                .addFields(
                    { name: '❓ `/ask`', value: 'Ask any question and get instant answers', inline: false },
                    { name: '📖 `/explain`', value: 'Get detailed explanations on topics', inline: false }
                )
                .setColor(0x3B82F6),

            practice: new EmbedBuilder()
                .setTitle('🎮 Practice & Compete')
                .setDescription('Test your knowledge and challenge others')
                .addFields(
                    { name: '✏️ `/practice`', value: 'Practice questions from chapters', inline: false },
                    { name: '⚔️ `/match`', value: 'Challenge friends in knowledge duels', inline: false },
                    { name: '🎯 `/quiz`', value: 'Take comprehensive quizzes', inline: false },
                    { name: '💡 `/hint`', value: 'Get hints for questions', inline: false }
                )
                .setColor(0x6366F1),

            progress: new EmbedBuilder()
                .setTitle('📊 Progress & Rewards')
                .setDescription('Track your achievements and climb the leaderboard')
                .addFields(
                    { name: '🏅 `/score`', value: 'Check your Gyan Gola balance', inline: false },
                    { name: '🏆 `/leaderboard`', value: 'See top 10 students', inline: false },
                    { name: '📅 `/dailyquest`', value: 'Claim daily bonus rewards', inline: false }
                )
                .setColor(0x10B981),

            admin: new EmbedBuilder()
                .setTitle('⚙️ Admin & Management')
                .setDescription('Manage bot and database (Admin only)')
                .addFields(
                    { name: '➕ `/addquestion`', value: 'Add new questions to database', inline: false },
                    { name: '➖ `/removepoints`', value: 'Remove Gyan Gola from users', inline: false }
                )
                .setColor(0x8B5CF6),

            stats: new EmbedBuilder()
                .setTitle('📈 Key Features')
                .setDescription('What makes Gyan Guru amazing')
                .addFields(
                    { name: '🤖 AI-Powered', value: 'Google Gemini AI for instant answers', inline: true },
                    { name: '🏆 Leaderboard', value: 'Compete with others globally', inline: true },
                    { name: '🎯 Streaks', value: 'Build daily study consistency', inline: true },
                    { name: '⚔️ PvP', value: 'Challenge friends head-to-head', inline: true },
                    { name: '🛡️ Safe', value: 'Protected against spam/abuse', inline: true },
                    { name: '⚡ Fast', value: 'Instant question generation', inline: true }
                )
                .setColor(0xF59E0B),

            level: new EmbedBuilder()
                .setTitle('⬆️ Level System')
                .setDescription('Track your progress with levels')
                .addFields(
                    { name: '🎯 How to Level Up', value: 'Earn Gyan Gola through all activities', inline: false },
                    { name: '💛 Gyan Gola Rewards', value: '• Correct Answer: +10\n• Quiz Bonus: +50\n• Daily Quest: +20\n• Match Win: +30', inline: false },
                    { name: '🔥 Daily Streak', value: 'Use `/dailyquest` every day for bonuses', inline: false }
                )
                .setColor(0xEC4899)
        };

        collector.on('collect', async (selectInteraction) => {
            const selected = selectInteraction.values[0];
            await selectInteraction.update({
                embeds: [categoryEmbeds[selected]],
                components: [row]
            });
        });

        collector.on('end', () => {
            message.edit({ components: [] }).catch(() => {});
        });
        } catch (error) {
            console.error('Error in help command:', error);
            await interaction.reply({
                content: '❌ An error occurred while loading the help menu. Please try again.',
                flags: 64
            });
        }
    },
};
