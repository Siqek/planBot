const { REST, Routes } = require('discord.js');
require('dotenv').config({ path: __dirname + '/../../.env' });

const rest = new REST().setToken(process.env.token);

console.log("WARNING! This will delete given commands.");
console.log("Are you sure you want to continue? [y/N]");

process.stdin.setEncoding('utf8');

process.stdin.on('data', (input) => {
    input = input.trim().toLowerCase(); // normalize the input

    if (input == 'y') // check to ensure you want to delete the commands
    {
        Object.values(process.argv.slice(2)).forEach(commandId => 
        {
            rest.delete(Routes.applicationCommand(process.env.clientId, commandId))
                .then(() => console.log(`Successfully deleted application command (with ID: ${commandId})`))
                .catch(console.error);
        });
    };
    
    process.stdin.pause(); // stop listening for input
    //process.exit(); // exit and stop the program
});