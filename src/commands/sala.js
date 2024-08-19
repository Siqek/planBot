const { SlashCommandBuilder } = require('discord.js');

const tools = require('../tools/functions');
const { createEmbed, embedColors, embedFields } = require('../embeds/EmbedCreator');
const Embeds = require('../embeds/Embeds');

const timeTable 	= require('../resources/timeTable.json');
const days 			= require('../resources/days.json');
const Time          = require('../tools/Time');

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
				'sala'      : `${sala}`,
				'czas'      : `${godzina}`,
				'day'       : `${dzien}`
			}
		);
		const data = await tools.fetchData(url);

		// TODO (siqek)
		//
		// [Zwraca "Break", jeśli obecny czas (brak ustawionego parametru day) jest po za godzinami lekcyjnymi (przed, po lub pomiędzy (przerwy)]
		// 
		// zabezpieczenie polecenia i uproszczenie warunku

		// TODO (siqek)
		//
		// embedTitle i embedDescription do zapisania gdzies
		// powtarza sie w poleceniach

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
		}
		else
		{
			await interaction.reply({ embeds: [Embeds.noDataToDisplay], ephemeral: true});
		};
    },
}