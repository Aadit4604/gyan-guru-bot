const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and their descriptions'),
    async execute(interaction) {
        const sections = [
            {
                title: '📚 Gyan Guru - Complete Guide',
                color: 0x3B82F6,
                description: '🎓 **Your Ultimate Study Companion for Grade 10 CBSE!**\n\n' +
                    'Welcome to Gyan Guru Bot! Explore all the amazing features and commands below to boost your learning journey.\n\n' +
                    '**📖 Available Sections:**\n' +
                    '• 📚 Learning Commands\n' +
                    '• 🎮 Practice & Competition\n' +
                    '• 📊 Progress & Rewards\n' +
                    '• ⚙️ Admin Commands\n' +
                    '• 💰 Gyan Gola System\n' +
                    '• ✨ Key Features\n' +
                    '• 💡 Pro Tips'
            },
            {
                title: '📚 Learning Commands',
                color: 0x3B82F6,
                description: '**Ask questions and get instant explanations from AI!**',
                fields: [
                    {
                        name: '❓ `/ask` - Ask the AI Assistant',
                        value: '```Ask any question and get instant, detailed answers powered by Google Gemini AI. Perfect for quick clarifications!```',
                        inline: false
                    },
                    {
                        name: '📖 `/explain` - Get Topic Explanations',
                        value: '```Get comprehensive explanations for any topic from your syllabus. Master difficult concepts step-by-step!```',
                        inline: false
                    }
                ]
            },
            {
                title: '🎮 Practice & Competition',
                color: 0x6366F1,
                description: '**Sharpen your skills and compete with friends!**',
                fields: [
                    {
                        name: '✏️ `/practice` - Practice Questions',
                        value: '```Practice questions from any chapter. Build your skills with instant feedback and solutions!```',
                        inline: false
                    },
                    {
                        name: '⚔️ `/match` - Knowledge Duels',
                        value: '```Challenge your friends to exciting knowledge battles. Compete head-to-head for bragging rights!```',
                        inline: false
                    },
                    {
                        name: '💡 `/hint` - Get Hints',
                        value: '```Stuck on a question? Get helpful hints to guide you toward the correct answer!```',
                        inline: false
                    },
                    {
                        name: '🚧 `/quiz` - Rapid-Fire Quiz',
                        value: '```Coming soon! Rapid-fire questions to test your knowledge. Stay tuned!```',
                        inline: false
                    }
                ]
            },
            {
                title: '📊 Progress & Rewards',
                color: 0x10B981,
                description: '**Track your progress and climb the leaderboard!**',
                fields: [
                    {
                        name: '🏅 `/score` - View Your Score',
                        value: '```Check your gyan gola balance and daily streak. Keep grinding to increase your rank!```',
                        inline: false
                    },
                    {
                        name: '🏆 `/leaderboard` - Global Rankings',
                        value: '```See the top 10 students competing for the crown. Aim high and reach the top!```',
                        inline: false
                    },
                    {
                        name: '📅 `/dailyquest` - Daily Bonus',
                        value: '```Claim your daily gyan gola bonus and maintain your streak for extra rewards!```',
                        inline: false
                    }
                ]
            },
            {
                title: '⚙️ Admin Commands',
                color: 0x8B5CF6,
                description: '**Manage the bot and maintain database (Admin only)**',
                fields: [
                    {
                        name: '➕ `/addquestion` - Add Questions',
                        value: '```Add new questions to the database to keep content fresh and diverse!```',
                        inline: false
                    },
                    {
                        name: '➖ `/removepoints` - Manage Points',
                        value: '```Remove gyan gola from users when necessary. Admin exclusive!```',
                        inline: false
                    }
                ]
            },
            {
                title: '💰 Gyan Gola System',
                color: 0x10B981,
                description: '**Earn gyan gola for every achievement and climb the ranks!**',
                fields: [
                    { name: '✅ Correct Answer', value: '`+10 gyan gola`', inline: true },
                    { name: '💡 With Hint Used', value: '`+5 gyan gola`', inline: true },
                    { name: '📅 Daily Bonus', value: '`+20 gyan gola`', inline: true },
                    { name: '⚔️ PvP Victory', value: '`+30 gyan gola`', inline: true },
                    { name: '🔥 Daily Streak', value: '`+5 bonus/day`', inline: true },
                    { name: '⏰ Time Limit', value: '`60 seconds`', inline: true }
                ]
            },
            {
                title: '✨ Key Features',
                color: 0xF59E0B,
                description: '**Discover what makes Gyan Guru amazing!**',
                fields: [
                    { name: '🤖 AI-Powered Learning', value: '`Google Gemini AI` for instant, accurate answers', inline: true },
                    { name: '📈 Leaderboard System', value: 'Track your rank and compete globally', inline: true },
                    { name: '🎯 Streak Mechanics', value: 'Build consistent study habits daily', inline: true },
                    { name: '⚔️ PvP Duels', value: 'Challenge friends in knowledge battles', inline: true },
                    { name: '🛡️ Rate Limited', value: 'Protected against spam and abuse', inline: true },
                    { name: '🌍 Multi-Server', value: 'Works seamlessly across Discord', inline: true }
                ]
            },
            {
                title: '💡 Pro Tips & Tricks',
                color: 0xEC4899,
                description: '**Master these tips to maximize your gyan gola!**',
                fields: [
                    { name: '📝 Daily Streak Mastery', value: '✨ Use `/dailyquest` **every single day** to build an unbreakable streak and earn continuous bonuses!', inline: false },
                    { name: '🎯 Practice Strategy', value: '✨ Set aside 30 mins daily for `/practice` to master all chapters. Consistency is key to success!', inline: false },
                    { name: '👥 Competitive Edge', value: '✨ Use `/match` to challenge friends! Friendly competition boosts motivation and learning!', inline: false },
                    { name: '🤖 AI Assistance', value: '✨ When stuck, use `/ask` or `/explain` to get instant clarity. No concept is too hard!', inline: false },
                    { name: '💡 Hint Strategy', value: '✨ Use hints wisely - you get fewer points but learn better. Balance points with knowledge!', inline: false }
                ]
            },
            {
                title: '✨ Credits & Support',
                color: 0x8B5CF6,
                description: '**Thanks for using Gyan Guru!**',
                fields: [
                    { name: '👨‍💻 Created By', value: '**Aadit & Yash**', inline: false },
                    { name: '💜 Feedback & Support', value: 'Help us improve! Share your suggestions and feedback anytime.', inline: false },
                    { name: '🚀 Coming Soon', value: 'More features, quizzes, and challenges coming very soon!', inline: false }
                ]
            }
        ];

        let currentPage = 0;

        const createEmbed = (pageIndex) => {
            const section = sections[pageIndex];
            const embed = new EmbedBuilder()
                .setTitle(section.title)
                .setColor(section.color)
                .setThumbnail(interaction.client.user.avatarURL())
                .setFooter({ 
                    text: `📄 Page ${pageIndex + 1}/${sections.length} | Created by: Aadit & Yash ✨`,
                    iconURL: interaction.client.user.avatarURL()
                });

            if (section.description) {
                embed.setDescription(section.description);
            }

            if (section.fields) {
                embed.addFields(section.fields);
            }

            return embed;
        };

        const createButtons = (pageIndex) => {
            const rows = [];

            // First row - Learning and Practice buttons
            const row1 = new ActionRowBuilder();
            row1.addComponents(
                new ButtonBuilder()
                    .setCustomId('help_learning')
                    .setLabel('📚 Learning')
                    .setStyle(pageIndex === 1 ? ButtonStyle.Success : ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('help_practice')
                    .setLabel('🎮 Practice')
                    .setStyle(pageIndex === 2 ? ButtonStyle.Success : ButtonStyle.Primary)
            );
            rows.push(row1);

            // Second row - Progress and Admin buttons
            const row2 = new ActionRowBuilder();
            row2.addComponents(
                new ButtonBuilder()
                    .setCustomId('help_progress')
                    .setLabel('📊 Progress')
                    .setStyle(pageIndex === 3 ? ButtonStyle.Success : ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('help_admin')
                    .setLabel('⚙️ Admin')
                    .setStyle(pageIndex === 4 ? ButtonStyle.Success : ButtonStyle.Primary)
            );
            rows.push(row2);

            // Third row - Gyan Gola and Features buttons
            const row3 = new ActionRowBuilder();
            row3.addComponents(
                new ButtonBuilder()
                    .setCustomId('help_gyan')
                    .setLabel('💰 Gyan Gola')
                    .setStyle(pageIndex === 5 ? ButtonStyle.Success : ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('help_features')
                    .setLabel('✨ Features')
                    .setStyle(pageIndex === 6 ? ButtonStyle.Success : ButtonStyle.Primary)
            );
            rows.push(row3);

            // Fourth row - Tips and Close buttons
            const row4 = new ActionRowBuilder();
            row4.addComponents(
                new ButtonBuilder()
                    .setCustomId('help_tips')
                    .setLabel('💡 Pro Tips')
                    .setStyle(pageIndex === 7 ? ButtonStyle.Success : ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('help_close')
                    .setLabel('❌ Close')
                    .setStyle(ButtonStyle.Danger)
            );
            rows.push(row4);

            return rows;
        };

        try {
            const message = await interaction.reply({
                embeds: [createEmbed(currentPage)],
                components: createButtons(currentPage),
                fetchReply: true
            });

            const collector = message.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 600000 // 10 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.customId === 'help_learning') {
                    currentPage = 1;
                } else if (buttonInteraction.customId === 'help_practice') {
                    currentPage = 2;
                } else if (buttonInteraction.customId === 'help_progress') {
                    currentPage = 3;
                } else if (buttonInteraction.customId === 'help_admin') {
                    currentPage = 4;
                } else if (buttonInteraction.customId === 'help_gyan') {
                    currentPage = 5;
                } else if (buttonInteraction.customId === 'help_features') {
                    currentPage = 6;
                } else if (buttonInteraction.customId === 'help_tips') {
                    currentPage = 7;
                } else if (buttonInteraction.customId === 'help_close') {
                    collector.stop();
                    await buttonInteraction.update({
                        content: '✅ Help dialog closed. Thanks for using Gyan Guru! 🎓',
                        embeds: [],
                        components: []
                    });
                    return;
                }

                await buttonInteraction.update({
                    embeds: [createEmbed(currentPage)],
                    components: createButtons(currentPage)
                });
            });

            collector.on('end', async () => {
                try {
                    await message.edit({ components: [] }).catch(() => {});
                } catch (error) {
                    console.error('Error removing buttons:', error);
                }
            });
        } catch (error) {
            console.error('Error in help command:', error);
            await interaction.reply({
                content: '❌ An error occurred while loading the help guide. Please try again.',
                ephemeral: true
            });
        }
    },
};
