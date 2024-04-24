const { SlashCommandBuilder } = require('discord.js');

const f = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nauczyciel')
		.setDescription('x')
      	.addStringOption(option =>
         	option.setName('nauczyciel')
            	.setDescription('x')
            	.setRequired(true)),
	async execute(interaction, time) {

		console.log(time.minutes(), time.hours(), time.day())
		await interaction.reply(`nauczyciel: ${interaction.options.getString('nauczyciel')}\nczas: ${time.getTime()}`);
	},
};