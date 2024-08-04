const { EmbedBuilder } = require('discord.js');

// TODO (siqek)
//
// huh??
// zbedna komplikacja kodu wymagajaca dodatkowej uwagi piszacego nowe polecenia
// po co funkcja tworzaca ma wymagac id embeda i znaldowac go w objekcie
// latwiej przekazac sam kolor odopwiednio oznaczony do zastosowania
// bedzie szybciej i latwiej

module.exports.embedsTypes = Object.freeze(
    {
        message: 
        {
            id   : Symbol('message'),
            color: 0x0032fa,
        },
        warning: 
        {
            id   : Symbol('warning'),
            color: 0xffe530,
        },
        error: 
        {
            id   : Symbol('error'),
            color: 0xff0f0f,
        },
    }
);

module.exports.createEmbed = function (embedTypeId) //embedTypeId must be value of id from embeds types array
{
    let embedType = Object.values(this.embedsTypes).find(embed => embed.id === embedTypeId);

    let embed = new EmbedBuilder()
        .setColor(embedType.color)
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