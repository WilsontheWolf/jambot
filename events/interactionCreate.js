import { commands } from '../util.js';

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 */
export default (client, interaction) => {
    if(interaction.isCommand){
        const cmd = commands.get(interaction.commandName);
        if(!cmd) {
            interaction.reply({content: 'I\'m sorry an error occurred!', ephemeral: true});
            return;
        }
        cmd.execute(client, interaction);
    } else {
        interaction.reply({ content: `I'm sorry, an error occurred.`, ephemeral: true });
    }
};