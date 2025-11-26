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
        
        try {
            const explanation = await explainTopic(topic, interaction.user.id);
            
            const embed = new EmbedBuilder()
                .setAuthor({ 
                    name: 'AI Study Guide',
                    iconURL: 'https://em-content.zobj.net/thumbs/160/twitter/348/books_1f4da.png'
                })
                .setTitle(`📚 ${topic}`)
                .setDescription(
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `${explanation}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `💡 **Need more help?** Use \`/ask\` for specific questions!`
                )
                .setColor(0x3B82F6)
                .setThumbnail('https://em-content.zobj.net/thumbs/160/twitter/348/open-book_1f4d6.png')
                .setFooter({ text: '📖 Gyan Guru AI • Study smarter, not harder' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('Sorry, I couldn\'t generate an explanation. Please try again with a different topic or rephrase.')
                .setColor(0xEF4444)
                .setFooter({ text: 'Contact an administrator if this persists' });
            
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};