const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and their descriptions')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Specific category to view')
                .setRequired(false)
                .addChoices(
                    { name: '📚 Learning', value: 'learning' },
                    { name: '🎮 Practice', value: 'practice' },
                    { name: '📊 Progress', value: 'progress' },
                    { name: '💡 Tips', value: 'tips' }
                )),
    async execute(interaction) {
        const category = interaction.options.getString('category');
        
        if (category === 'learning') {
            const embed = new EmbedBuilder()
                .setTitle('📚 Learning Commands')
                .setDescription('Use AI-powered tools to learn and understand concepts better!')
                .setColor(0x3B82F6)
                .addFields(
                    { 
                        name: '❓ /ask <query>', 
                        value: '```Get instant answers to any academic question```\n*Example: /ask What is photosynthesis?*\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    },
                    { 
                        name: '📖 /explain <topic>', 
                        value: '```Get detailed explanations with examples```\n*Example: /explain Photosynthesis*\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    }
                )
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/books_1f4da.png')
                .setFooter({ text: '💡 Powered by Google Gemini AI' });
            return interaction.reply({ embeds: [embed] });
        }
        
        if (category === 'practice') {
            const embed = new EmbedBuilder()
                .setTitle('🎮 Practice & Competition Commands')
                .setDescription('Challenge yourself and compete with friends!')
                .setColor(0x8B5CF6)
                .addFields(
                    { 
                        name: '✏️ /practice [chapter]', 
                        value: '```Practice questions and earn points```\n*+10 points per correct answer*\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    },
                    { 
                        name: '⚔️ /match <@opponent>', 
                        value: '```Challenge a friend to a knowledge duel```\n*Winner gets +30 points*\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    },
                    { 
                        name: '💡 /hint', 
                        value: '```Get a hint during practice```\n*Reduces points to +5*\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    }
                )
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/video-game_1f3ae.png')
                .setFooter({ text: '⏱️ 60 seconds per question' });
            return interaction.reply({ embeds: [embed] });
        }
        
        if (category === 'progress') {
            const embed = new EmbedBuilder()
                .setTitle('📊 Progress & Rewards Commands')
                .setDescription('Track your progress and compete with classmates!')
                .setColor(0x10B981)
                .addFields(
                    { 
                        name: '🏅 /score', 
                        value: '```View your points, streak, and rank```\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    },
                    { 
                        name: '🏆 /leaderboard', 
                        value: '```See top 10 students in your class```\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    },
                    { 
                        name: '📅 /dailyquest', 
                        value: '```Claim daily rewards (+20 pts + streak bonus)```\n*Build a streak for extra points!*\n━━━━━━━━━━━━━━━━━━━━━━', 
                        inline: false 
                    }
                )
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/trophy_1f3c6.png')
                .setFooter({ text: '🔥 Don\'t break your streak!' });
            return interaction.reply({ embeds: [embed] });
        }
        
        if (category === 'tips') {
            const embed = new EmbedBuilder()
                .setTitle('💡 Pro Tips & Strategies')
                .setDescription('Master these strategies to become a top student!')
                .setColor(0xF59E0B)
                .addFields(
                    { name: '🔥 Build Your Streak', value: 'Use `/dailyquest` daily for +5 bonus points per day!', inline: false },
                    { name: '📚 Practice Daily', value: 'Answer at least 5 questions per day to retain knowledge', inline: false },
                    { name: '⚔️ Challenge Friends', value: 'PvP matches give 3x points compared to practice', inline: false },
                    { name: '💡 Use Hints Wisely', value: 'Only use hints when absolutely stuck to maximize points', inline: false },
                    { name: '🎯 Focus on Weak Areas', value: 'Practice chapters where you struggle the most', inline: false },
                    { name: '👥 Study Together', value: 'Challenge classmates to make learning fun', inline: false }
                )
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/light-bulb_1f4a1.png')
                .setFooter({ text: 'Consistency is key! 🌟' });
            return interaction.reply({ embeds: [embed] });
        }

        // Main overview embed
        const mainEmbed = new EmbedBuilder()
            .setTitle('📚 Gyan Guru - Study Companion Bot')
            .setDescription(
                '**Welcome to your AI-powered study assistant!**\n\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                '**Quick Start Guide:**\n' +
                '📚 `/ask` - Ask any academic question\n' +
                '✏️ `/practice` - Practice questions and earn points\n' +
                '🏆 `/leaderboard` - See class rankings\n' +
                '📅 `/dailyquest` - Get daily rewards\n\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                '💰 **Points System:**\n' +
                '```\n✅ Correct Answer   → +10 pts\n💡 With Hint       → +5 pts\n⚔️  Win PvP Match   → +30 pts\n📅 Daily Quest     → +20 pts\n🔥 Streak Bonus    → +5 pts/day```\n\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━'
            )
            .setColor(0x6366F1)
            .addFields(
                { name: '📚 Learning', value: 'AI-powered Q&A and explanations', inline: true },
                { name: '🎮 Practice', value: 'Questions, hints, and duels', inline: true },
                { name: '📊 Progress', value: 'Scores, leaderboard, and streaks', inline: true }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 256 }))
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setFooter({ text: 'Use the buttons below to explore each category' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('help_learning')
                    .setLabel('Learning')
                    .setEmoji('📚')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('help_practice')
                    .setLabel('Practice')
                    .setEmoji('🎮')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('help_progress')
                    .setLabel('Progress')
                    .setEmoji('📊')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('help_tips')
                    .setLabel('Pro Tips')
                    .setEmoji('💡')
                    .setStyle(ButtonStyle.Danger)
            );

        const response = await interaction.reply({ embeds: [mainEmbed], components: [row], fetchReply: true });

        // Button collector
        const collector = response.createMessageComponentCollector({ time: 120000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'This help menu is not for you! Use `/help` to get your own.', ephemeral: true });
            }

            const category = i.customId.split('_')[1];
            
            let embed;
            if (category === 'learning') {
                embed = new EmbedBuilder()
                    .setTitle('📚 Learning Commands')
                    .setDescription('Use AI-powered tools to learn and understand concepts better!')
                    .setColor(0x3B82F6)
                    .addFields(
                        { name: '❓ /ask <query>', value: '```Get instant answers to any academic question```\n*Example: /ask What is photosynthesis?*\n━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                        { name: '📖 /explain <topic>', value: '```Get detailed explanations with examples```\n*Example: /explain Photosynthesis*\n━━━━━━━━━━━━━━━━━━━━━━', inline: false }
                    )
                    .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/books_1f4da.png')
                    .setFooter({ text: '💡 Powered by Google Gemini AI' });
            } else if (category === 'practice') {
                embed = new EmbedBuilder()
                    .setTitle('🎮 Practice & Competition Commands')
                    .setDescription('Challenge yourself and compete with friends!')
                    .setColor(0x8B5CF6)
                    .addFields(
                        { name: '✏️ /practice [chapter]', value: '```Practice questions and earn points```\n*+10 points per correct answer*\n━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                        { name: '⚔️ /match <@opponent>', value: '```Challenge a friend to a knowledge duel```\n*Winner gets +30 points*\n━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                        { name: '💡 /hint', value: '```Get a hint during practice```\n*Reduces points to +5*\n━━━━━━━━━━━━━━━━━━━━━━', inline: false }
                    )
                    .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/video-game_1f3ae.png')
                    .setFooter({ text: '⏱️ 60 seconds per question' });
            } else if (category === 'progress') {
                embed = new EmbedBuilder()
                    .setTitle('📊 Progress & Rewards Commands')
                    .setDescription('Track your progress and compete with classmates!')
                    .setColor(0x10B981)
                    .addFields(
                        { name: '🏅 /score', value: '```View your points, streak, and rank```\n━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                        { name: '🏆 /leaderboard', value: '```See top 10 students in your class```\n━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                        { name: '📅 /dailyquest', value: '```Claim daily rewards (+20 pts + streak bonus)```\n*Build a streak for extra points!*\n━━━━━━━━━━━━━━━━━━━━━━', inline: false }
                    )
                    .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/trophy_1f3c6.png')
                    .setFooter({ text: '🔥 Don\'t break your streak!' });
            } else if (category === 'tips') {
                embed = new EmbedBuilder()
                    .setTitle('💡 Pro Tips & Strategies')
                    .setDescription('Master these strategies to become a top student!')
                    .setColor(0xF59E0B)
                    .addFields(
                        { name: '🔥 Build Your Streak', value: 'Use `/dailyquest` daily for +5 bonus points per day!', inline: false },
                        { name: '📚 Practice Daily', value: 'Answer at least 5 questions per day to retain knowledge', inline: false },
                        { name: '⚔️ Challenge Friends', value: 'PvP matches give 3x points compared to practice', inline: false },
                        { name: '💡 Use Hints Wisely', value: 'Only use hints when absolutely stuck to maximize points', inline: false },
                        { name: '🎯 Focus on Weak Areas', value: 'Practice chapters where you struggle the most', inline: false },
                        { name: '👥 Study Together', value: 'Challenge classmates to make learning fun', inline: false }
                    )
                    .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/light-bulb_1f4a1.png')
                    .setFooter({ text: 'Consistency is key! 🌟' });
            }

            await i.update({ embeds: [embed], components: [row] });
        });

        collector.on('end', () => {
            row.components.forEach(button => button.setDisabled(true));
            interaction.editReply({ components: [row] }).catch(() => {});
        });
    },
};
