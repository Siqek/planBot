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
		const klasa         = interaction.options.getString('klasa').toUpperCase(); //cannot be null
		const godzina       = interaction.options.getNumber('godzina') ?? time.getLessonNumber();
		const dzien         = interaction.options.getNumber('dzien')   ?? time.day();

		if (
			godzina < 0   // there are no more lessons
			|| dzien > 5  // there is a weekend (5 => friday)
		)
		{
			let embed = createEmbed(embedColors.warning).setTitle("Nie ma lekcji");

			await interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		};

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

			let embeds = [];

			data.forEach(e =>
			{
				const embed = createEmbed(embedColors.message)
				.setTitle(embedTitle)
				.setDescription(embedDescription)
				.addFields(
					{ name: 'Nauczyciel:', value: `${e.nauczyciel}`, inline: true },
					embedFields.gap,
					{ name: 'Sala lekcyjna:', value: `${e.sala}`, inline: true },
					embedFields.newLine,
					{ name: `Klas${(e.klasa.length > 1 ? 'y' : 'a')}:`, value: `${e.klasa.join(', ')}`, inline: true },
					embedFields.gap,
					{ name: 'Przedmiot:', value: `${e.lekcja}`, inline: true },
				);

				embeds.push(embed);
			});

			await interaction.reply({ embeds: embeds, ephemeral: false });	
		}
		else
		{
			await interaction.reply({ embeds: [Embeds.noDataToDisplay], ephemeral: true});
		};
		// TODO (siqek)
		//
		// kilka embedow => pagination system 
    },
}