const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');

// Load environment variables
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

// Validation
if (!TOKEN) {
    console.error('❌ ERROR: DISCORD_TOKEN not found in .env file');
    process.exit(1);
}

if (!CLIENT_ID) {
    console.error('❌ ERROR: DISCORD_CLIENT_ID not found in .env file');
    process.exit(1);
}

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
    failIfNotExists: false 
});

client.commands = new Collection();
const commands = [];

// Load Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`📂 Loading ${commandFiles.length} commands...`);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`  ✅ Loaded command: ${command.data.name}`);
        } else {
            console.warn(`  ⚠️ Command ${file} missing "data" or "execute" property`);
        }
    } catch (err) {
        console.error(`  ❌ Error loading command ${file}:`, err.message);
    }
}

// Load Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log(`📂 Loading ${eventFiles.length} events...`);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`  ✅ Loaded event: ${event.name}`);
    } catch (err) {
        console.error(`  ❌ Error loading event ${file}:`, err.message);
    }
}

// Deploy Commands
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`\n🚀 Deploying ${commands.length} slash commands...`);

        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log(`✅ Successfully deployed ${data.length} slash commands!`);
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
        process.exit(1);
    }
})();

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Login
client.login(TOKEN).catch(err => {
    console.error('❌ Failed to login:', err.message);
    process.exit(1);
});