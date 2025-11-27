# 📚 Gyan Guru Bot - AI-Powered CBSE Study Companion

[![Discord.js](https://img.shields.io/badge/discord.js-v14.14-blue?logo=discord)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/node.js-v16+-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> 🎓 A powerful Discord bot designed to help Grade 10 CBSE students study smarter, practice effectively, and compete with classmates using AI-powered learning!

---

## ✨ Key Features

### 🤖 AI-Powered Learning
- **Instant Answers**: Ask any question and get detailed answers via Google Gemini AI
- **Topic Explanations**: Get comprehensive explanations for difficult concepts
- **Smart Responses**: Formatted answers optimized for Discord

### 📚 Practice & Learning
- **Question Bank**: Solve practice questions from all chapters
- **Hints System**: Get helpful hints without losing all points
- **Instant Feedback**: Understand correct answers immediately

### 🏆 Gamification
- **Gyan Gola System**: Earn points for correct answers
- **Daily Streaks**: Build consistent study habits with daily bonuses
- **PvP Duels**: Challenge friends in knowledge battles
- **Leaderboard**: Compete globally and track your rank

### ⚡ Performance & Reliability
- **Rate Limiting**: Smart API rate limiting to prevent abuse
- **Multi-API Support**: Load balancing between multiple Gemini API keys
- **Error Handling**: Graceful error messages and recovery
- **Auto Cleanup**: Automatic memory optimization

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v16 or higher
- **Discord Bot Token**: From [Discord Developer Portal](https://discord.com/developers)
- **Google Gemini API Keys**: From [Google AI Studio](https://aistudio.google.com)
- **Discord Server**: For testing the bot

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd gyan-guru-bot
npm install
```

2. **Create `.env` file**
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
API_KEY_1=your_gemini_api_key_1
API_KEY_2=your_gemini_api_key_2_optional
```

3. **Start the bot**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

---

## 📖 Available Commands

All commands are slash commands (`/`). Type `/` in Discord to see all available commands!

### 🎓 Learning Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/ask` | Ask the AI assistant any question | `/ask what is photosynthesis` |
| `/explain` | Get detailed topic explanations | `/explain Photosynthesis` |

### 🎮 Practice & Competition

| Command | Description |
|---------|-------------|
| `/practice` | Practice questions and earn points |
| `/match` | Challenge a friend to a PvP duel |
| `/hint` | Get a hint for the current question |
| `/quiz` | Rapid-fire quiz mode (Coming Soon) |

### 📊 Progress Tracking

| Command | Description |
|---------|-------------|
| `/score` | View your score, streak, and rank |
| `/leaderboard` | See top 10 students |
| `/dailyquest` | Claim daily bonus and maintain streak |

### ⚙️ Admin Commands

| Command | Description | Permission |
|---------|-------------|-----------|
| `/addquestion` | Add new questions to database | Admin |
| `/removepoints` | Remove points from users | Admin |

### ℹ️ Other Commands

| Command | Description |
|---------|-------------|
| `/help` | Interactive help guide |

---

## 💰 Gyan Gola System

Earn **Gyan Gola** (GP) by studying and competing:

| Activity | Points |
|----------|--------|
| ✅ Correct Answer | +10 GP |
| 💡 With Hint Used | +5 GP |
| 📅 Daily Quest | +20 GP base |
| 🔥 Streak Bonus | +5 GP per day (up to +50) |
| ⚔️ PvP Victory | +30 GP |

### Leaderboard Rankings
- 🥇 **Gold**: #1 Rank
- 🥈 **Silver**: #2 Rank  
- 🥉 **Bronze**: #3 Rank
- ⭐ **Star**: Top 10 Ranks

---

## 🛠️ Project Structure

```
gyan-guru-bot/
├── 📁 commands/              # All slash commands
│   ├── help.js              # Interactive help menu
│   ├── ask.js               # AI question answering
│   ├── explain.js           # Topic explanations
│   ├── practice.js          # Practice mode
│   ├── match.js             # PvP battles
│   ├── score.js             # Score display
│   ├── leaderboard.js       # Rankings
│   ├── dailyquest.js        # Daily rewards
│   ├── hint.js              # Hint system
│   ├── quiz.js              # Quiz mode
│   ├── addquestion.js       # Admin: Add questions
│   ├── removepoints.js      # Admin: Manage points
│   └── ...
├── 📁 events/               # Discord event handlers
│   ├── ready.js            # Bot startup
│   └── interactionCreate.js # Command processor
├── 📁 utils/                # Utility modules
│   ├── ai.js               # Google Gemini integration
│   ├── points.js           # Score management
│   ├── questionManager.js  # Question handling
│   └── rateLimit.js        # Rate limiting
├── 📁 data/                 # Data storage
│   ├── questions.json      # Question database
│   ├── scores.json         # User scores & stats
│   └── chapters.json       # Chapter metadata
├── .env                     # Environment variables
├── config.json              # Bot configuration
├── index.js                 # Main bot file
├── package.json             # Dependencies
└── README.md                # This file
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Discord
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id

# Google Gemini API
API_KEY_1=your_primary_api_key
API_KEY_2=your_secondary_api_key  # Optional for load balancing
```

### Bot Permissions

Required permissions:
- `Send Messages` - Post responses
- `Embed Links` - Send embeds
- `Attach Files` - Share files if needed
- `Read Message History` - Context awareness

### Rate Limiting Configuration

Edit `utils/rateLimit.js`:
```javascript
const CONFIG = {
    USER_LIMIT: 4,              // Requests per minute per user
    WARNING_THRESHOLD: 0.75     // Show warning at 75% usage
};
```

---

## 📈 Development Guide

### Adding a New Command

1. Create `commands/mycommand.js`:
```javascript
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mycommand')
        .setDescription('What this command does'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Hello!')
            .setColor(0x3B82F6);
        
        await interaction.reply({ embeds: [embed] });
    }
};
```

2. Bot automatically loads it on restart!

### Modifying the Question Database

Edit `data/questions.json`:
```json
{
    "id": 1,
    "subject": "Biology",
    "chapter": "Cell Structure",
    "question": "What is the powerhouse of the cell?",
    "options": [
        "Mitochondria",
        "Nucleus",
        "Ribosome",
        "Golgi Apparatus"
    ],
    "correctAnswer": 0,
    "hint": "Produces energy for the cell",
    "difficulty": "Easy"
}
```

---

## 🐛 Troubleshooting

### ❌ Bot Not Responding
**Solution:**
- ✅ Verify `DISCORD_TOKEN` in `.env`
- ✅ Check Discord Developer Portal settings
- ✅ Ensure bot has proper permissions
- ✅ Check bot intents are enabled

### ⚠️ Rate Limit Warnings
**Solution:**
- ✅ This is normal with high usage
- ✅ Users should wait 60 seconds before retrying
- ✅ Adjust `USER_LIMIT` in `utils/rateLimit.js`

### 🔑 API Key Errors
**Solution:**
- ✅ Verify API key is valid and active
- ✅ Check Google API quota and billing
- ✅ Try using secondary API key
- ✅ Generate new API key if needed

### 📊 Score Issues
**Solution:**
- ✅ Check `data/scores.json` is writable
- ✅ Verify file permissions
- ✅ Check disk space availability

---

## 📊 Statistics & Monitoring

View logs to monitor bot performance:
```bash
npm start 2>&1 | tee bot.log
```

Monitor:
- Command execution rates
- API response times
- Error frequencies
- User engagement

---

## 🚀 Performance Tips

1. **Use Multiple API Keys**: Load balance across 2+ Gemini keys
2. **Enable Rate Limiting**: Prevent API quota exhaustion
3. **Regular Cleanup**: Archive old user data monthly
4. **Monitor Logs**: Track and fix errors proactively

---

## 📋 Planned Features

- [ ] SQLite/MongoDB database integration
- [ ] User profiles with badges & achievements
- [ ] Custom difficulty levels
- [ ] Study group collaboration
- [ ] Progress tracking & analytics
- [ ] Mobile companion app
- [ ] Text-to-speech explanations

---

## 📝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👨‍💼 Authors

Created with ❤️ by **Aadit & Yash**

---

## 💬 Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join our Discord community for discussions
- **Email**: Contact through repository

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord bot framework
- [Google Gemini AI](https://ai.google.dev/) - AI model
- [Node.js](https://nodejs.org/) - Runtime environment

---

**Made for students. Powered by AI. Built for learning. 🎓✨**
- **Loss PvP Match**: `0 gyan gola`

## 🔧 Configuration

### Bot Intents

The bot uses these intents:
- `GatewayIntentBits.Guilds` - Join/leave servers
- `GatewayIntentBits.DirectMessages` - DM support
- `GatewayIntentBits.MessageContent` - Read message content for prefix commands

### Rate Limiting

AI commands are rate-limited to:
- **5 requests per minute** per user
- **Warning** at 80% usage
- Auto-cleanup of expired entries every 5 minutes

## 📁 Project Structure

```
discord-bot/
├── commands/              # All command files
│   ├── ask.js            # AI question answering
│   ├── explain.js        # Topic explanations
│   ├── practice.js       # Practice mode
│   ├── match.js          # PvP duels
│   ├── score.js          # View score
│   ├── leaderboard.js    # Leaderboard
│   ├── dailyquest.js     # Daily rewards
│   ├── hint.js           # Get hints
│   ├── quiz.js           # Quiz mode (soon)
│   ├── addquestion.js    # Admin: Add questions
│   ├── removepoints.js   # Admin: Remove points
│   └── help.js           # Help menu
├── events/               # Event handlers
│   ├── ready.js          # Bot startup
│   └── interactionCreate.js  # Command routing
├── utils/                # Utility functions
│   ├── ai.js            # Google Gemini integration
│   ├── points.js        # Score management
│   ├── questionManager.js  # Question database handling
│   └── rateLimit.js     # Rate limiting system
├── data/                 # Data storage
│   ├── questions.json   # Question database
│   ├── scores.json      # User scores
│   └── chapters.json    # Chapter metadata
├── config.json          # Bot configuration
├── index.js             # Main bot file
├── package.json         # Dependencies
└── README.md            # This file
```

## 🛠️ Development

### Adding New Commands

1. Create a file in `commands/` folder:
```javascript
module.exports = {
    name: 'commandname',
    description: 'What it does',
    async execute(message, args) {
        // Your command logic
        await message.reply('Hello!');
    }
};
```

2. The bot will automatically load it!

### Modifying Questions

Edit `data/questions.json` to add or modify questions:
```json
{
    "id": 1,
    "subject": "Biology",
    "chapter": "Cell Structure",
    "question": "What is the powerhouse of the cell?",
    "options": ["Mitochondria", "Nucleus", "Ribosome", "Golgi Apparatus"],
    "correctAnswer": 0,
    "hint": "It produces energy for the cell",
    "difficulty": "Easy"
}
```

## 🐛 Troubleshooting

### Bot not responding?
- Check if bot has Message Content Intent enabled
- Verify token in `.env` or `config.json`
- Check bot permissions in Discord server

### Rate limit warnings?
- This is normal - users are making many AI requests
- Wait 60 seconds before trying again

### API key errors?
- Verify Google Gemini API key is valid
- Check API quota and billing status

## 📝 Future Improvements

- [ ] Database migration (MongoDB/SQLite)
- [ ] Persistent sessions
- [ ] User profiles with badges
- [ ] Custom difficulty levels
- [ ] Timed quiz mode
- [ ] Study group features
- [ ] Progress tracking graphs

## 📞 Support

For issues or suggestions, please create an issue or contact the bot administrator.

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Learning! 🎓**

*Made with ❤️ for students*
