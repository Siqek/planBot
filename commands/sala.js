const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

require("dotenv").config();

const __tools = require('../functions');

const timeTable 	= require('../resources/timeTable.json');
const days 			= require('../resources/days.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sala')
		.setDescription('x')
      	.addStringOption(option =>
         	option.setName('sala')
            	.setDescription('x')
            	.setRequired(true)
		)
		.addNumberOption(option =>
			option.setName('godzina')
				.setDescription('x')
				.addChoices(
					...timeTable.map(lesson =>({ 'name': lesson.name, 'value': lesson.value }))
				)
		)
		.addNumberOption(option =>
			option.setName('dzien')
				.setDescription('x')
				.addChoices(
					...days
				)
		),
    async execute (interaction, ntpTime)
    {

    },
}