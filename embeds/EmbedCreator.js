const { EmbedBuilder } = require('discord.js');

module.exports = {
    embedsTypes: Object.freeze(
        {
            messange : 
            {
                id   : Symbol('messange'),
                color: 0x0032fa,
            },
            warning  : 
            {
                id   : Symbol('warning'),
                color: 0xffe530,

            },
            error    : 
            {
                id   : Symbol('error'),
                color: 0xff0f0f,
            },
        }
    ),
    createEmbed: function (embedTypeId) //embedTypeId must be value of id from embeds types array
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
    }
}
