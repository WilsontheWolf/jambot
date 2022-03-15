import util from 'node:util';

export default {
    info: {
        name: 'eval',
        description: 'Beep boop!',
        args: [{
            type: 'STRING',
            name: 'code',
            description: 'The code to evaluate',
            required: true,
        }],
    }, 
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        if (interaction.user.id !== '517371142508380170') {
            interaction.reply({ content: 'I\'m sorry, an error occurred.', ephemeral: true });
            return;
        }
        try {
            const code = interaction.options.getString('code');
            const evaled = await eval(code);
            interaction.reply({ content: `${util.inspect(evaled)}`, ephemeral: true });
        }
        catch (err) {
            interaction.reply({ content: `I'm sorry, an error occurred.\n${err}`, ephemeral: true });
        }
    }
}