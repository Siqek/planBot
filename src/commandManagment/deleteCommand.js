process.argv.slice(2).forEach((value, index) => 
{
    console.log(`${index}: ${value}`);
});

// TODO (siqek)
//
// skończyć polecenie

// const { REST, Routes } = require('discord.js');
// const { clientId, guildId, token } = require('./config.json');

// const rest = new REST().setToken(token);

// rest.delete(Routes.applicationCommand(clientId, 'commandId'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);

// TODO (siqek)
//
// zabezpieczenie hasłem?? albo coś podobnego