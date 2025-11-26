# 📚 Padh Lo Bot - Grade 10 CBSE Study Companion

A powerful Discord bot designed to help Grade 10 CBSE students study, practice, and compete with their classmates!

## ✨ Features

- **AI-Powered Learning**: Ask questions and get instant explanations using Google Gemini AI
- **Practice Mode**: Solve practice questions and earn points
- **PvP Matches**: Challenge friends in knowledge duels for bonus points
- **Leaderboard**: Track your ranking among classmates
- **Daily Quests**: Earn rewards for consistent daily engagement
- **Streak System**: Build study streaks for motivation
- **Rate Limiting**: Built-in protection against API spam

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Discord Bot Token
- Google Gemini API Key
- A Discord Server to test the bot

### Installation

1. **Clone the repository** (or download the files)
```bash
cd discord-bot
npm install
```

2. **Configure environment variables**
Create a `.env` file in the root directory:
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
API_KEY=your_gemini_api_key_here
```

Or update `config.json`:
```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "apiKey": "YOUR_GEMINI_API_KEY"
}
```

3. **Start the bot**
```bash
npm start
```

You should see:
```
✅ Bot is ready!
Bot loaded X commands
```

## 📖 Commands

All commands use the **`!` prefix**. Example: `!help`, `!practice`

### Learning Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!ask` | Ask the AI Study Assistant a question | `!ask what is photosynthesis` |
| `!explain` | Get detailed explanations for topics | `!explain Photosynthesis` |
| `!hint` | Get a hint for your practice question | `!hint` (during practice) |

### Practice & Competition

| Command | Description | Usage |
|---------|-------------|-------|
| `!practice` | Practice a random or specific chapter question | `!practice` or `!practice Biology` |
| `!match` | Challenge another player to a duel | `!match @friend` |
| `!quiz` | Start a rapid-fire quiz (Coming Soon) | `!quiz` |

### Progress & Rewards

| Command | Description | Usage |
|---------|-------------|-------|
| `!score` | View your current points and streak | `!score` |
| `!leaderboard` | View top 10 students | `!leaderboard` |
| `!dailyquest` | Claim your daily check-in bonus | `!dailyquest` |

### Admin Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!addquestion` | Add a new question to the database | `!addquestion Math Algebra [question] [correct] [wrong1] [wrong2] [wrong3] [hint]` |
| `!removepoints` | Remove points from a user | `!removepoints @user 50` |

## 📊 Points System

- **Correct Answer** (Practice): `+10 points`
- **Correct with Hint Used**: `+5 points`
- **Daily Quest**: `+20 points + 5 bonus`
- **Win PvP Match**: `+30 points`
- **Loss PvP Match**: `0 points`

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
