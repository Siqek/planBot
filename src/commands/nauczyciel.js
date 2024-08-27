const { SlashCommandBuilder } = require('discord.js');

const tools = require('../tools/functions');
const { embedColors, createEmbed, embedFields } = require('../embeds/EmbedCreator');
const Embeds = require('../embeds/Embeds');

const timeTable     = require('../resources/timeTable.json');
const days          = require('../resources/days.json');
const Time          = require('../tools/Time');

var teacherNames = [];

(async function fetchTeacherNames () 
{
	console.log("Started downloading teacher names");

	// download data
	const data = await tools.fetchData(tools.prepareUrl(process.env.url, '/nauczyciele'));

	// create an array from downloaded data
	for (i in data) 
	{
		teacherNames.push({ name: data[i], value: i});
	};
	
	// remove useless elements from the array
	teacherNames.filter(choise => !choise.name.includes('vacat') && !choise.name.includes('vakat'));
	// sort teachers names by last name
	teacherNames.sort((a, b) => {
		if (a.name.slice(2) > b.name.slice(2)) return 1;
		if (a.name.slice(2) < b.name.slice(2)) return -1;
		return 0;
	});

	console.log("Successfully downloaded teacher names");
})();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nauczyciel')
		.setDescription('Wyświetla dane lekcji prowadzonej przez określonego nauczyciela.')
      	.addStringOption(option =>
         	option.setName('nauczyciel')
            	.setDescription('Wyszukaj nauczyciela')
            	.setRequired(true)
				.setAutocomplete(true)
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
	async autocomplete (interaction)
	{
		const value = interaction.options.getFocused().trim().toLowerCase();

		const filtered = teacherNames.filter(
				teacherName => (
					teacherName.name.toLowerCase().includes(value)
					|| teacherName.value.toLowerCase().includes(value)
				)
			)
			.slice(0, 25);

		if (!interaction) return;

		await interaction.respond(filtered.map((teacherName) => (
			{
				name: `${teacherName.name} (${teacherName.value})`,
				value: teacherName.value
			}
		)));
	},
	async execute (interaction, time) 
	{
		const nauczyciel 	= interaction.options.getString('nauczyciel'); //cannot be null
		const godzina 		= interaction.options.getNumber('godzina')     ?? time.getLessonNumber();
		const dzien 		= interaction.options.getNumber('dzien')       ?? time.day();
		// const visibility    = (interaction.options.getString('widocznosc') ?? "true") == "true"; // converts a string into a boolean value

		if (
			godzina < 0   // there are no more lessons
			|| dzien > 5  // there is a weekend (5 => friday)
		)
		{
			let embed = createEmbed(embedColors.warning).setTitle("Nie ma lekcji");

			await interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		};

		//check if the teacher even exist
		const lowerCaseNauczyciel = nauczyciel.toLowerCase();
		if (!teacherNames.some(teacherName => (
				teacherName.name.toLowerCase().includes(lowerCaseNauczyciel) 
				|| teacherName.value.toLowerCase().includes(lowerCaseNauczyciel)
			)))
		{
			//the teacher doesn't exist or the name is wrong
			await interaction.reply({ embeds: [Embeds.wrongTeacherName], ephemeral: true });
			return;
		}

		const url = tools.prepareUrl(
			process.env.url, '/', 
			{
				'nauczyciel': `${nauczyciel}`,
				'czas'		: `${godzina}`,
				'day'		: `${dzien}`
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
		
		await interaction.reply({ embeds: [embed] });
	},
};