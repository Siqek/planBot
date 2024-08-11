const { EmbedBuilder } = require('discord.js');

module.exports.embedColors = Object.freeze(
    {
        message : 0x0032fa,
        warning : 0xffe530,
        error   : 0xff0f0f,
    }
);

module.exports.createEmbed = function (embedColor = this.embedColor.message) // embed template
{
    let embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTimestamp()
        .setFooter(
            {
                text: "PlanBot",
                iconURL: "http://www.zs1mm.home.pl/strona/wp-content/uploads/2022/03/cropped-korona.png"
            }
        );
    
    return embed;
}.bind(module.exports); //bind 'this' to 'module.exports' (this==module.exports)

module.exports.embedFields = Object.freeze(
    {
        gap     : { name: '\u200B', value: '\u200B', inline: true }, //gap works if 2 fields between gap has property `inline` equals true
        newLine : { name: '\u200B', value: '\u200B', inline: false }
    }
);