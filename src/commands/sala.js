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
		const res = await tools.fetchData(url);

		if (res == 'Break')
		{
			console.log("UNEXPECTED RESPONSE: 'BREAK'!", `URL: ${url}`);
			await interaction.reply({ embeds: [Embeds.noDataToDisplay], ephemeral: true });
			return;
		}

		if (!res.length)
		{
			// there is no lesson (free period)
			await interaction.reply({ embeds: [Embeds.noDataToDisplay], ephemeral: true});
			return;
		}

		const data = res[0];

		const embed = createEmbed(embedColors.message)
		.setTitle(days[dzien - 1].name)
		.setDescription(Time.formatLessonTime(godzina - 1))
		.addFields(
			{ name: 'Nauczyciel:', value: `${data.nauczyciel}`, inline: true },
			embedFields.gap,
			{ name: 'Sala lekcyjna:', value: `${data.sala}`, inline: true },
			embedFields.newLine,
			{ name: 'Klasy:', value: `${data.klasa.join(', ')}`, inline: true },
			embedFields.gap,
			{ name: 'Przedmiot:', value: `${data.lekcja}`, inline: true },
		);
		
		await interaction.reply({ embeds: [embed], ephemeral: false });	

    },
}