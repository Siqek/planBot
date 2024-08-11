const { SlashCommandBuilder } = require('discord.js');

const tools = require('../tools/functions');
const { embedColors, createEmbed, embedFields } = require('../embeds/EmbedCreator');
const Embeds = require('../embeds/Embeds');

const timeTable 	= require('../resources/timeTable.json');
const days 			= require('../resources/days.json');
const Time          = require('../tools/Time');

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
    async execute (interaction, time)
    {
		console.log('/klasa');
		const klasa         = interaction.options.getString('klasa'); //cannot be null
		const godzina       = interaction.options.getNumber('godzina') ?? time.getLessonNumber();
		const dzien         = interaction.options.getNumber('dzien')   ?? time.day();

		const url = tools.prepareUrl(
			process.env.url, '/', 
			{
				'klasa' : `${klasa}`,
				'czas'       : `${godzina}`,
				'day'        : `${dzien}`
			}
		);
		const data = await tools.fetchData(url);

		console.log(data, godzina, dzien);

		if (data.length && data !== 'Break')
		{
			const embedTitle = days[dzien - 1].name;
			const embedDescription = (function makeDescription ()
			{
				let lesson = timeTable[godzina - 1];
				return `${lesson.startH}:${Time.formatMinutes(lesson.startM)}-${lesson.endH}:${Time.formatMinutes(lesson.endM)}`;
			})();

			const embed = createEmbed(embedColors.message)
			.setTitle(embedTitle)
			.setDescription(embedDescription)
			.addFields(
				{ name: 'Nauczyciel:', value: `${data[0].nauczyciel}`, inline: true },
				embedFields.gap,
				{ name: 'Sala lekcyjna:', value: `${data[0].sala}`, inline: true },
				embedFields.newLine,
				{ name: `Klas${(data[0].klasa.length > 1 ? 'y' : 'a')}:`, value: `${data[0].klasa.join(', ')}`, inline: true },
				embedFields.gap,
				{ name: 'Przedmiot:', value: `${data[0].lekcja}`, inline: true },
			);
			
			await interaction.reply({ embeds: [embed], ephemeral: false });	
		};
		// TODO (siqek)
		//
		// pagination system || kilka embedow
    },
}