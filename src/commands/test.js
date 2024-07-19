// TODO (siqek)
//
// do usunięcia po zakończeniu testowania

const { SlashCommandBuilder } = require('discord.js');

const Embeds = require('../embeds/Embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test')
      	.addStringOption(option =>
         	option.setName('option')
            	.setDescription('option test')),
	async execute(interaction, _) {
		await interaction.reply({ embeds: Object.values(Embeds), ephemeral: true});
	},
};