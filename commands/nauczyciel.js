const { SlashCommandBuilder } = require('discord.js');

require("dotenv").config();

const __tools = require('../functions');

const timeTable 	= require('../resouces/timeTable.json');
const days 			= require('../resouces/days.json');

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
			option.setName('dzień')
				.setDescription('x')
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
			dzien			: interaction.options.getNumber('dzień')
		}
		const nauczyciel 	= options.nauczyciel;
		const godzina 		= (options.godzina === null ? __tools.whichLesson(ntpTime) : options.godzina);
		const dzien 		= (options.dzien === null ? ntpTime.day() : options.day);

		if (!teachersNames.some(teacherName => 
			(
				teacherName.name.includes(nauczyciel) 
				|| teacherName.value.includes(nauczyciel)
			)
		))
		{
			//the teacher doesn't exist or wrong name
			await interaction.reply({ content: `INFO O BŁĘDNIE NAPISANYM NAZWISKU NAUCZYCIELA`, ephemeral: true });
			return;
		}

		const data = await __tools.fetchData(
			__tools.prepareUrl(
				process.env.url, 
				'/', 
				{
					'nauczyciel': `${nauczyciel}`,
					'czas'		: `${godzina}`,
					'day'		: `${dzien}`
				}
			)
		);

		if (data.length)
		{
			await interaction.reply(`nauczyciel: ${nauczyciel}\nczas: ${ntpTime.getTime()}`);
		}
		else
		{
			await interaction.reply({ content: 'brak dopasowań', ephemeral: true });
		}
	},
};