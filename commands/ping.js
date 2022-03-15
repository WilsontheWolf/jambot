export default {
    info: {
        name: 'ping',
        description: 'Pong!',
        args: [],
    }, 
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        interaction.reply('Pong!');
    }
}