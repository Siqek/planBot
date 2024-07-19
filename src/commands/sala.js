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
		const options = {
			sala            : interaction.options.getString('sala'),
			godzina         : interaction.options.getNumber('godzina'),
			dzien           : interaction.options.getNumber('dzien')
		}
		const sala          = options.sala;
		const godzina       = (options.godzina === null ? __tools.getLessonNumber(time) : options.godzina);
		const dzien         = (options.dzien === null ? time.day() : options.dzien);

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