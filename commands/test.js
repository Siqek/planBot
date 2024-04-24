const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test')
      	.addStringOption(option =>
         	option.setName('option')
            	.setDescription('option test')),
	async execute(interaction, _) {
        console.log(interaction.options);
		await interaction.reply('testowa');
	},
};