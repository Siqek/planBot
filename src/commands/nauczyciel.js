const { SlashCommandBuilder } = require('discord.js');

const __tools = require('../tools/functions');
const { embedsTypes, createEmbed, embedFields } = require('../embeds/EmbedCreator');
const Embeds = require('../embeds/Embeds');

const timeTable     = require('../resources/timeTable.json');
const days          = require('../resources/days.json');
const Time          = require('../tools/Time');

var teachersNames = [];

(async function fetchTeachersNames () 
{
	console.log("Started downloading teacher names");

	// download data
	const data = await __tools.fetchData(__tools.prepareUrl(process.env.url, '/nauczyciele'));

	// create an array from downloaded data
	for (i in data) 
	{
		teachersNames.push({ name: data[i], value: i});
	};
	
	// remove useless elements from the array
	teachersNames.filter(choise => !choise.name.includes('vacat') && !choise.name.includes('vakat'));
	// sort teachers names by last name
	teachersNames.sort((a, b) => {
		if (a.name.slice(2) > b.name.slice(2)) return 1;
		if (a.name.slice(2) < b.name.slice(2)) return -1;
		return 0;
	});

	console.log("Successfully downloaded teacher names");
})();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nauczyciel')
		.setDescription('x')
      	.addStringOption(option =>
         	option.setName('nauczyciel')
            	.setDescription('x')
            	.setRequired(true)
				.setAutocomplete(true)
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
		// .addBooleanOption(option =>
		// 	option.setName('widocznosc')
		// 		.setDescription('x')
		// 		.addChoices(

		// 		)
		//),
	async autocomplete (interaction)
	{
		const value = interaction.options.getFocused().trim().toLowerCase();

		const filtered = teachersNames.filter(
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
		//
		const nauczyciel 	= interaction.options.getString('nauczyciel'); //cannot be null
		const godzina 		= interaction.options.getNumber('godzina')    ?? time.getLessonNumber();
		const dzien 		= interaction.options.getNumber('dzien')      ?? time.day();

		//check if the teacher even exist
		if (!teachersNames.some(teacherName => (
				teacherName.name.includes(nauczyciel) 
				|| teacherName.value.includes(nauczyciel)
			)))
		{
			//the teacher doesn't exist or the name is wrong
			await interaction.reply({ embeds: [Embeds.wrongTeacherName], ephemeral: true });
			return;
		}

		const url = __tools.prepareUrl(
			process.env.url, '/', 
			{
				'nauczyciel': `${nauczyciel}`,
				'czas'		: `${godzina}`,
				'day'		: `${dzien}`
			}
		);
		const data = await __tools.fetchData(url);
		
		if (data.length && data !== 'Break')
		{
			// TODO (siqek)
			//
			// sprawdzanie poprawności otrzymanego obiektu do fukncji

			// TODO (siqek)
			//
			// optymalizacja wykorzystywanie otrzymanego obiektu z API
			// nie korzystanie z `data[0].` tylko czegoś bradziej przyjemnego w korzystaniu

			const embedTitle = days[dzien - 1].name;
			const embedDescription = (function makeDescription ()
			{
				let lesson = timeTable[godzina - 1];
				return `${lesson.startH}:${Time.formatMinutes(lesson.startM)}-${lesson.endH}:${Time.formatMinutes(lesson.endM)}`;
			})();

			const embed = createEmbed(embedsTypes.message.id)
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
			// TODO (siqek)
			//
			// wykorzystanie gotowego embedu z pliku 
			// często powtarzana wiadomość

			await interaction.reply({ content: 'brak dopasowań', ephemeral: true });
		}
	},
};