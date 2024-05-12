const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

require("dotenv").config();

const __tools = require('../functions');

const timeTable 	= require('../resources/timeTable.json');
const days 			= require('../resources/days.json');

var teachersNames = [];

(async function fetchTeachersNames () 
{
	let data = await __tools.fetchData(__tools.prepareUrl(process.env.url, '/nauczyciele'));

	for (i in data) 
	{
		teachersNames.push({ name: data[i], value: i})
	};
	
	teachersNames.filter(choise => !choise.name.includes('vacat', 'vakat'));
	teachersNames.sort((a, b) => {
		if (a.name.slice(2) > b.name.slice(2)) return 1;
		if (a.name.slice(2) < b.name.slice(2)) return -1;
		return 0;
	});
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
				.setDescription('x') //check it later ('\u200B' as param)
				.addChoices(
					...days
				)
		),
	async autocomplete (interaction)
	{
		const value = interaction.options.getFocused().trim().toLowerCase();

		const filtered = teachersNames
			.filter(
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
	async execute (interaction, ntpTime) 
	{
		const options = {
			nauczyciel		: interaction.options.getString('nauczyciel'),
			godzina			: interaction.options.getNumber('godzina'),
			dzien			: interaction.options.getNumber('dzien')
		}
		const nauczyciel 	= options.nauczyciel;
		const godzina 		= (options.godzina === null ? __tools.getLessonNumber(ntpTime) : options.godzina);
		const dzien 		= (options.dzien === null ? ntpTime.day() : options.dzien);

		//check if the teacher even exist
		if (!teachersNames.some(teacherName => 
			(
				teacherName.name.includes(nauczyciel) 
				|| teacherName.value.includes(nauczyciel)
			)
		))
		{
			//the teacher doesn't exist or the name is wrong
			await interaction.reply({ content: `INFO O BŁĘDNIE NAPISANYM NAZWISKU NAUCZYCIELA`, ephemeral: true });
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
			const embedTitle = days[dzien - 1].name;
			const embedDescription = (function makeDescription ()
			{
				let lesson = timeTable[godzina - 1];
				return `${lesson.startH}:${lesson.startM}-${lesson.endH}:${lesson.endM}`;
			})();

			const embed = new EmbedBuilder()
				.setTitle(embedTitle)
				.setDescription(embedDescription)
				.setColor(0x0032fa)
				.addFields(
					{ name: 'Nauczyciel:', value: `${data[0].nauczyciel}`, inline: true },
					{ name: '\u200B', value: '\u200B', inline: true }, //gap between 2 fields in a row
					{ name: 'Sala lekcyjna:', value: `${data[0].sala}`, inline: true },
					{ name: '\u200B', value: '\u200B', inline: false }, //new line, gap between 2 columns
					{ name: `Klas${(data[0].klasa.length > 1 ? 'y' : 'a')}:`, value: `${data[0].klasa.join(', ')}`, inline: true },
					{ name: '\u200B', value: '\u200B', inline: true },
					{ name: 'Przedmiot:', value: `${data[0].lekcja}`, inline: true },
				)
				.setTimestamp()
				.setFooter(
					{
						text: "PlanBot",
						iconURL: "http://www.zs1mm.home.pl/strona/wp-content/uploads/2022/03/cropped-korona.png"
					}
				);
			
			await interaction.reply({ embeds: [embed], ephemeral: false });
		}
		else
		{
			await interaction.reply({ content: 'brak dopasowań', ephemeral: true });
		}
	},
};