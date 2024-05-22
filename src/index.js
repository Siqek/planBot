const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

require('dotenv').config({ path: __dirname+'/../.env' });

const NtpTime = require('./tools/NtpTime');
const ntpTime = new NtpTime();

setInterval(() => { ntpTime.update() }, 20 * 1000); //Update time after each 20 seconds

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Nie znaleziono odpowiadającej komendy: ${interaction.commandName}.`);
		return;
	}
	
	if (!interaction.isChatInputCommand()) 
	{
		if (interaction.isAutocomplete())
		{
			try {
				await command.autocomplete(interaction);
			} catch (err) {
				console.log(err)
				return;
			}
		}

		return;
	}

	try {
		await command.execute(interaction, ntpTime);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Napotkano błąd podczas wykonywania polecenia.', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Napotkano błąd podczas wykonywania polecenia.', ephemeral: true });
		}
	}
});

client.login(process.env.token);