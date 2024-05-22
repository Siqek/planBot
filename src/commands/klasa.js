const { SlashCommandBuilder } = require('discord.js');

const __tools = require('../tools/functions');

const timeTable 	= require('../resources/timeTable.json');
const days 			= require('../resources/days.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('klasa')
		.setDescription('x')
      	.addStringOption(option =>
         	option.setName('klasa')
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