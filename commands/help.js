const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and their descriptions'),
    async execute(interaction) {
        const commands = [
            {
                category: '📚 Learning',
                items: [
                    { name: '/ask', description: 'Ask the AI Study Assistant a question', emoji: '❓' },
                    { name: '/explain', description: 'Get detailed explanations for topics', emoji: '📖' },
                ]
            },
            {
                category: '🎮 Practice & Competition',
                items: [
                    { name: '/practice', description: 'Practice questions from any chapter', emoji: '✏️' },
                    { name: '/match', description: 'Challenge a friend to a knowledge duel', emoji: '⚔️' },
                    { name: '/hint', description: 'Get a hint for current practice question', emoji: '💡' },
                    { name: '/quiz', description: 'Start a rapid-fire quiz (Coming Soon)', emoji: '🚧' },
                ]
            },
            {
                category: '📊 Progress & Rewards',
                items: [
                    { name: '/score', description: 'View your current points and streak', emoji: '🏅' },
                    { name: '/leaderboard', description: 'View top 10 students', emoji: '🏆' },
                    { name: '/dailyquest', description: 'Claim your daily check-in bonus', emoji: '📅' },
                ]
            },
            {
                category: '⚙️ Admin Commands',
                items: [
                    { name: '/addquestion', description: 'Add a new question to database', emoji: '➕' },
                    { name: '/removepoints', description: 'Remove points from a user', emoji: '➖' },
                ]
            }
        ];

        // Create main help embed
        const mainEmbed = new EmbedBuilder()
            .setTitle('📚 Padh Lo Bot - Complete Guide')
            .setDescription('Your ultimate study companion for Grade 10 CBSE!\n\n**Use the commands below to get started:**')
            .setColor(0x3B82F6)
            .setThumbnail(interaction.client.user.avatarURL())
            .setFooter({ text: 'Padh Lo Bot • Built for students' });

        // Add category embeds
        const embeds = [mainEmbed];

        for (const category of commands) {
            let description = '';
            for (const item of category.items) {
                description += `${item.emoji} **${item.name}**\n${item.description}\n\n`;
            }

            if (description.trim().length > 0) {
                const categoryEmbed = new EmbedBuilder()
                    .setTitle(category.category)
                    .setColor(0x6366F1)
                    .setDescription(description.trim());
                embeds.push(categoryEmbed);
            }
        }

        // Add points and features embed
        const pointsEmbed = new EmbedBuilder()
            .setTitle('💰 Points System')
            .setColor(0x10B981)
            .addFields(
                { name: '✅ Correct Answer', value: '+10 points', inline: true },
                { name: '💡 With Hint Used', value: '+5 points', inline: true },
                { name: '📅 Daily Quest', value: '+20 points + bonus', inline: true },
                { name: '⚔️ Win PvP Match', value: '+30 points', inline: true },
                { name: '🔥 Streak Bonus', value: '+5 per day', inline: true },
                { name: '⏰ Time Limit', value: '60 seconds per question', inline: true }
            );
        embeds.push(pointsEmbed);

        // Add features embed
        const featuresEmbed = new EmbedBuilder()
            .setTitle('✨ Key Features')
            .setColor(0xF59E0B)
            .setDescription(
                '🤖 **AI-Powered** - Get instant answers from Google Gemini\n' +
                '📈 **Leaderboard** - Compete with your classmates\n' +
                '🎯 **Streak System** - Build consistent study habits\n' +
                '⚔️ **PvP Duels** - Challenge friends in knowledge battles\n' +
                '🛡️ **Rate Limited** - Protected against API spam\n' +
                '🌍 **Global** - Works across all Discord servers'
            );
        embeds.push(featuresEmbed);

        // Add tips embed
        const tipsEmbed = new EmbedBuilder()
            .setTitle('💡 Pro Tips')
            .setColor(0xEC4899)
            .addFields(
                { name: '📝 Daily Streak', value: 'Use `/dailyquest` every day to build your streak!', inline: false },
                { name: '🎯 Consistent Practice', value: 'Regular practice is key to success', inline: false },
                { name: '👥 Challenge Friends', value: 'Use `/match` to make learning fun and competitive', inline: false },
                { name: '🤖 Ask Anything', value: 'Stuck? Use `/ask` to get instant explanations', inline: false }
            );
        embeds.push(tipsEmbed);

        try {
            await interaction.reply({ embeds });
        } catch (error) {
            console.error('Error in help command:', error);
            await interaction.reply({ 
                content: '❌ An error occurred while loading the help guide. Please try again.', 
                ephemeral: true 
            });
        }
    },
};
