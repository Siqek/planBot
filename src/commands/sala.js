const { SlashCommandBuilder } = require('discord.js');

const __tools = require('../tools/functions');

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
    async execute (interaction, time)
    {
		const sala          = interaction.options.getString('sala');
		const godzina       = interaction.options.getNumber('godzina') ?? time.getLessonNumber();
		const dzien         = interaction.options.getNumber('dzien')   ?? time.day();

		const url = __tools.prepareUrl(
			process.env.url, '/', 
			{
				'sala'      : `${sala}`,
				'czas'      : `${godzina}`,
				'day'       : `${dzien}`
			}
		);
		const data = await __tools.fetchData(url);

		if (data.length && data !== 'Break')
		{
			// TODO (siqek)
			//
			// dokończyć
		}
    },
}