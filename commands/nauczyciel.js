const { SlashCommandBuilder } = require('discord.js');

require("dotenv").config();

const __tools = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nauczyciel')
		.setDescription('x')
      	.addStringOption(option =>
         	option.setName('nauczyciel')
            	.setDescription('x')
            	.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete (interaction)
	{
		const value = interaction.options.getFocused().toLowerCase();

		let choises = [];

		let data = await __tools.fetchData(__tools.prepareUrl(process.env.url, '/nauczyciele'));

		for (i in data) 
		{
			choises.push({ name: data[i], value: i})
		};

		choises.filter(choise => !choise.name.includes('vacat', 'vakat'));

		const filtered = choises
			.filter(
				choise => (
					choise.name.toLowerCase().includes(value) 
					|| choise.value.toLowerCase().includes(value)
				)
			)
			.slice(0, 25)
			.sort((a, b) => {
				if (a.name.slice(2) > b.name.slice(2)) return 1;
				if (a.name.slice(2) < b.name.slice(2)) return -1;
				return 0;
			});

		if (!interaction) return;

		await interaction.respond(filtered);
	},
	async execute (interaction, time) 
	{
		console.log(time.minutes(), time.hours(), time.day())
		await interaction.reply(`nauczyciel: ${interaction.options.getString('nauczyciel')}\nczas: ${time.getTime()}`);
	},
};