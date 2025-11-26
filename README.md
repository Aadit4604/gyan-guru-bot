# 📚 Gyan Guru - AI Study Companion Bot

> *An interactive Discord bot designed to help Grade 10 CBSE students study smarter with AI-powered learning, gamification, and competitive features.*

[![Discord.js](https://img.shields.io/badge/Discord.js-v14.14.0-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)](https://ai.google.dev/)

---

## ✨ Key Features

🤖 **AI-Powered Learning** - Get instant explanations using Google Gemini AI  
✏️ **Interactive Practice** - Beautiful, engaging question sessions with visual feedback  
⚔️ **PvP Duels** - Challenge classmates in epic knowledge battles  
🏆 **Advanced Leaderboard** - Visual ranking with medals and progress bars  
🔥 **Streak System** - Daily rewards with milestone bonuses (7, 14, 30+ days)  
📊 **Progress Tracking** - Detailed stats with rank badges and achievements  
🎨 **Modern UI** - Rich embeds with emojis, colors, and interactive buttons  
🛡️ **Rate Limiting** - Smart API protection against spam

---

## 🚀 Quick Setup

### Step 1: Prerequisites

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **Discord Bot Token** ([Discord Developer Portal](https://discord.com/developers/applications))
- **Google Gemini API Key** ([Google AI Studio](https://makersuite.google.com/app/apikey))

### Step 2: Installation

```bash
# Clone the repository
git clone https://github.com/Aadit4604/gyan-guru-bot.git
cd gyan-guru-bot

# Install dependencies
npm install
```

### Step 3: Configuration

Create a `.env` file in the root directory:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
API_KEY=your_google_gemini_api_key_here
```

**Alternative:** Edit `config.json`:
```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "apiKey": "YOUR_GEMINI_API_KEY"
}
```

### Step 4: Enable Bot Intents

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Navigate to **Bot** section
4. Enable these **Privileged Gateway Intents**:
   - ✅ **Message Content Intent**
   - ✅ **Server Members Intent**
   - ✅ **Presence Intent**

### Step 5: Invite Bot to Server

Use this URL (replace `YOUR_CLIENT_ID`):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### Step 6: Start the Bot

```bash
npm start
```

**Success indicators:**
```
✅ Bot is ready!
✅ Successfully reloaded application (/) commands globally.
Bot loaded 10 commands
```

---

## 📖 Commands Reference

### 📚 Learning Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/ask <query>` | Ask AI any academic question | `/ask What is photosynthesis?` |
| `/explain <topic>` | Get detailed topic explanations | `/explain Quadratic Equations` |

### 🎮 Practice & Competition

| Command | Description | Rewards |
|---------|-------------|---------|
| `/practice [chapter]` | Practice questions with beautiful UI | +10 pts (or +5 with hint) |
| `/match @user` | Challenge friend to PvP duel | Winner: +30 pts |
| `/hint` | Get hint for active question | Reduces reward to +5 pts |

### 📊 Progress & Rewards

| Command | Description | Features |
|---------|-------------|----------|
| `/score` | View detailed progress report | Points, streak, rank, progress bar |
| `/leaderboard` | Top 10 students with visuals | Medals, bars, streak indicators |
| `/dailyquest` | Claim daily rewards | +20 pts + streak bonus |

### 🎯 Interactive Help System

| Command | Description |
|---------|-------------|
| `/help` | Interactive help with category buttons |
| `/help category:<option>` | View specific category details |

---

## 💰 Points & Rewards System

| Action | Points | Notes |
|--------|--------|-------|
| ✅ Correct Answer (Practice) | **+10** | Full reward without hint |
| 💡 Correct with Hint | **+5** | Half reward when hint used |
| 🏆 Win PvP Match | **+30** | First correct answer wins |
| 📅 Daily Quest | **+20** | Base daily reward |
| 🔥 Streak Bonus | **+5/day** | Added automatically |

### 🔥 Streak Milestones

- **3 Days** ⭐ - Growing Streak
- **7 Days** 🔥 - Week Streak (Special badge)
- **14 Days** ⚡ - Epic Streak
- **30 Days** 💎 - Diamond Streak (Legendary!)
- **60+ Days** 🏆 - Ultimate dedication

---

## 🎨 Visual Features

### Modern Embeds
- 🎨 **Color-coded by difficulty** (Easy: Green, Medium: Orange, Hard: Red)
- 📊 **Progress bars** showing rank advancement
- 🏅 **Dynamic badges** based on performance
- ⏱️ **Countdown timers** on all timed challenges
- 🎭 **Context-aware emojis** and thumbnails

### Interactive Elements
- ✅ **Button-based answers** (no typing required)
- 🔘 **Category navigation** in help menu
- 🎯 **Accept/Decline buttons** for duels
- ⚡ **Real-time feedback** on selections

### Status Indicators
- 🌱 **Beginner** (0-99 pts)
- 📖 **Active Student** (100-249 pts)
- ✏️ **Dedicated Learner** (250-499 pts)
- 📚 **Advanced Student** (500-999 pts)
- 🌟 **Master Scholar** (1000+ pts)

---

## 🗂️ Project Structure

```
gyan-guru-bot/
├── commands/              # Slash command files
│   ├── ask.js            # AI Q&A with visual embeds
│   ├── explain.js        # Detailed topic explanations
│   ├── practice.js       # Enhanced practice mode
│   ├── match.js          # PvP duel system
│   ├── hint.js           # Hint system with penalties
│   ├── score.js          # Progress dashboard
│   ├── leaderboard.js    # Visual rankings
│   ├── dailyquest.js     # Daily rewards & streaks
│   ├── help.js           # Interactive help menu
│   ├── addquestion.js    # Admin: Add questions
│   └── removepoints.js   # Admin: Moderate points
├── events/               # Discord event handlers
│   ├── ready.js          # Bot initialization
│   └── interactionCreate.js  # Command routing
├── utils/                # Helper functions
│   ├── ai.js            # Google Gemini integration
│   ├── points.js        # Score management
│   ├── questionManager.js  # Question database
│   └── rateLimit.js     # API rate limiting
├── data/                 # JSON data storage
│   ├── questions.json   # Question bank
│   ├── scores.json      # User statistics
│   └── chapters.json    # Chapter metadata
├── .env                  # Environment variables
├── config.json          # Alternative configuration
├── index.js             # Main bot file
└── package.json         # Dependencies
```

---

## 🛠️ Development Guide

### Adding New Questions

Edit `data/questions.json`:

```json
{
  "id": 1,
  "subject": "Biology",
  "chapter": "Cell Structure",
  "question": "What is the powerhouse of the cell?",
  "options": ["Mitochondria", "Nucleus", "Ribosome", "Golgi Body"],
  "correctAnswer": 0,
  "hint": "It produces energy (ATP) for the cell",
  "difficulty": "Easy"
}
```

### Creating New Commands

1. Create file in `commands/` folder:

```javascript
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commandname')
        .setDescription('What it does'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Your Title')
            .setDescription('Your content')
            .setColor(0x6366F1);
        
        await interaction.reply({ embeds: [embed] });
    }
};
```

2. Bot auto-loads on restart!

### Customizing Colors

```javascript
// Embed color codes used in the bot
0x3B82F6  // Blue - Learning/Info
0x10B981  // Green - Success/Correct
0xEF4444  // Red - Error/Wrong/Hard
0xF59E0B  // Orange - Warning/Medium
0x8B5CF6  // Purple - Progress/Competition
0xFCD34D  // Gold - Leaderboard/Rewards
0x6366F1  // Indigo - Main/Help
0x6B7280  // Gray - Neutral
```

---

## 🐛 Troubleshooting

### Bot not responding?

**Solution:**
1. ✅ Verify bot has **Message Content Intent** enabled
2. ✅ Check `.env` or `config.json` credentials
3. ✅ Ensure bot has proper permissions in Discord server
4. ✅ Restart the bot with `npm start`

### "Rate limit exceeded" errors?

**Solution:**
- Wait 60 seconds between AI requests
- This protects against API quota exhaustion
- Each user has individual rate limits (5 req/min)

### Commands not appearing?

**Solution:**
```bash
# Clear Discord cache (Ctrl+Shift+I in Discord)
# Or wait up to 1 hour for global command sync
```

### Database/Score issues?

**Solution:**
- Check `data/scores.json` exists and is valid JSON
- Backup before manual edits
- Bot auto-creates files on first run

---

## 💡 Pro Tips

1. **Daily Routine**: Use `/dailyquest` every day to maximize points
2. **Strategic Hints**: Only use hints when truly stuck (saves 5 points)
3. **PvP Strategy**: Challenge friends for 3x points vs regular practice
4. **Streak Protection**: Set daily reminders to maintain your streak
5. **Focus Practice**: Use `/practice [chapter]` for weak subjects
6. **Compete Friendly**: Check `/leaderboard` daily for motivation

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Aadit** - [@Aadit4604](https://github.com/Aadit4604)

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API library
- [Google Gemini](https://ai.google.dev/) - AI-powered explanations
- [Node.js](https://nodejs.org/) - JavaScript runtime

---

<div align="center">

**Happy Learning! 🎓**

*Made with ❤️ for CBSE students*

⭐ **Star this repo if you find it helpful!**

</div>
