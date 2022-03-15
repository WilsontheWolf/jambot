import { Client, Intents } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs/promises';
import { commands } from './util.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

(async () => {
    // Event handler
    const events = (await fs.readdir('./events/')).filter(file => file.endsWith('.js'));
    for (const file of events) {
        const eventName = file.split('.')[0];
        console.log(`Registering event: ${eventName}`);
        const event = await import(`./events/${file}`);
        client.on(eventName, event.default.bind(null, client));
    };

    // Command handler
    const commandFiles = (await fs.readdir('./commands/')).filter(file => file.endsWith('.js'));
    const toRegister = [];
    for (const file of commandFiles) {
        console.log(`Loading command: ${file}`);
        const command = await import(`./commands/${file}`);
        commands.set(command.default.info.name, command.default);
        toRegister.push({
            name: command.default.info.name,
            description: command.default.info.description,
            type: 'CHAT_INPUT',
            options: command.default.info.args,
        });
    }
    const guildId = process.env.REGISTER_COMMANDS_GLOBALLY === 'true' ? undefined : process.env.DEFAULT_GUILD;
    client.on('ready', async () => {
        const registeredCommands = await client.application.commands.fetch(undefined, { guildId });
        for (const command of toRegister) {
            const cmd = registeredCommands.find(c => c.name === command.name);
            if (!cmd) {
                console.log(`Registering command: ${command.name}`);
                await client.application.commands.create(command, guildId);
            }
            else if (cmd.description !== command.description || JSON.stringify(cmd.options) !== JSON.stringify(command.options)) {
                console.log(`Updating command: ${command.name}`);
                await client.application.commands.edit(cmd.id, command, guildId);
            }
        }
    })
})();

client.login(process.env.TOKEN);