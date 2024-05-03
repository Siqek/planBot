const { SlashCommandBuilder } = require('discord.js');

require("dotenv").config();

const __tools = require('../functions');

const timeTable = require('../resouces/timeTable.json');
const days = require('../resouces/days.json');

var choises = [];

(async function fetchChoises () 
{
	let data = await __tools.fetchData(__tools.prepareUrl(process.env.url, '/nauczyciele'));

	for (i in data) 
	{
		choises.push({ name: `${data[i]} (${i})`, value: i})
	};
	
	choises.filter(choise => !choise.name.includes('vacat', 'vakat'));
	choises.sort((a, b) => {
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
					...timeTable
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

		const filtered = choises
			.filter(
				choise => (choise.name.toLowerCase().includes(value))
			)
			.slice(0, 25);

		if (!interaction) return;

		await interaction.respond(filtered);
	},
	async execute (interaction, time) 
	{
		const nauczyciel = interaction.options.getString('nauczyciel');
		const czas = interaction.options.getNumber('godzina');
		const dzien = interaction.options.getNumber('dzień');

		console.log(dzien, czas)

		const data = await __tools.fetchData(
			__tools.prepareUrl(
				process.env.url, 
				'/', 
				{
					'nauczyciel': `${nauczyciel}`,
					'czas'		: `${czas}`,
					'day'		: `${dzien}`
				}
			)
		);
		console.log(data);
		await interaction.reply(`nauczyciel: ${nauczyciel}\nczas: ${time.getTime()}`);
	},
};