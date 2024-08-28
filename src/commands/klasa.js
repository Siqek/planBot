const { SlashCommandBuilder } = require('discord.js');

const pagination = require('../command-functions/pagination');

const tools = require('../tools/functions');
const { embedColors, createEmbed, embedFields } = require('../embeds/EmbedCreator');
const Embeds = require('../embeds/Embeds');

const timeTable     = require('../resources/timeTable.json');
const days          = require('../resources/days.json');
const Time          = require('../tools/Time');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('klasa')
		.setDescription('Wyświetla dane lekcji, w której uczestniczy wskazana klasa.')
      	.addStringOption(option =>
         	option.setName('klasa')
            	.setDescription('Oznaczenie klasy')
            	.setRequired(true)
		)
		.addNumberOption(option =>
			option.setName('godzina')
				.setDescription('Numer lekcji')
				.addChoices(
					...timeTable.map(lesson =>({ 'name': lesson.name, 'value': lesson.value }))
				)
		)
		.addNumberOption(option =>
			option.setName('dzien')
				.setDescription('Dzień tygodnia')
				.addChoices(
					...days
				)
		// )
		// .addStringOption(option =>
		// 	option.setName('widocznosc')
		// 		.setDescription('Kto może zobaczyć wiadomość')
		// 		.addChoices(
		// 			{
		// 				name: "wszyscy",
		// 				value: "false"
		// 			},
		// 			{
		// 				name: "tylko ty",
		// 				value: "true"
		// 			}
		// 		)
		),
    async execute (interaction, time)
    {
		const klasa         = interaction.options.getString('klasa').toUpperCase(); //cannot be null
		const godzina       = interaction.options.getNumber('godzina') ?? time.getLessonNumber();
		const dzien         = interaction.options.getNumber('dzien')   ?? time.day();
		//const visibility    = (interaction.options.getString('widocznosc') ?? "true") == "true"; // converts a string into a boolean value

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

		let embeds = [];
		let groups = [];

		res.forEach((data, index) =>
		{
			const embed = createEmbed(embedColors.message)
			.setTitle(days[dzien - 1].name)
			.setDescription(Time.formatLessonTime(godzina - 1))
			.addFields(
				{ name: 'Nauczyciel:', value: `${data.nauczyciel}`, inline: true },
				embedFields.gap,
				{ name: 'Sala lekcyjna:', value: `${data.sala}`, inline: true },
				embedFields.newLine,
				{ name: 'Klasy', value: `${data.klasa.join(', ')}`, inline: true },
				embedFields.gap,
				{ name: 'Przedmiot:', value: `${data.lekcja}`, inline: true },
			);

			embeds.push(embed);

			groups.push({ name: `${index + 1}. ${data.nauczyciel}`, value: `${data.klasa.join(', ')}`, inline: false });

		});

		if (embeds.length > 1)
		{
			embeds.unshift(
				createEmbed(embedColors.message)
				.setTitle(days[dzien - 1].name)
				.setDescription(`${Time.formatLessonTime(godzina - 1)}\n### Grupy: `)
				.addFields(...groups)
			);
		}

		await pagination(interaction, embeds);
	},
}