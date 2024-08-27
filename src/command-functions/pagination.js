const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = async (interaction, pages, time = 30 * 1000) => {
    try 
    {
        if (!interaction || !pages || !pages > 0) throw new Error('PAGINATION :: Invalid args');

        await interaction.deferReply();

        if (pages.length === 1)
            return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });

        var index = 0;

        const first = new ButtonBuilder()
        .setCustomId("page_first")
        .setEmoji('⏪')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

        const prev = new ButtonBuilder()
        .setCustomId("page_prev")
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);

        const page_count = new ButtonBuilder()
        .setCustomId("page_count")
        .setLabel(`${index + 1}/${pages.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

        const next = new ButtonBuilder()
        .setCustomId("page_next")
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary);

        const last = new ButtonBuilder()
        .setCustomId("page_last")
        .setEmoji('⏩')
        .setStyle(ButtonStyle.Primary);

        const buttons = new ActionRowBuilder().addComponents([ first, prev, page_count, next, last ]);

        const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true });

        const collector = msg.createMessageComponentCollector({ 
            componentType: ComponentType.Button,
            time
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id)
                return await i.reply({ content: `Nie możesz edytować tego polecenia. Nie jesteś jego właścicielem.`, ephemeral: true });

            await i.deferUpdate();

            switch (i.customId)
            {
                case 'page_first':
                    index = 0;
                    break;
                case 'page_prev':
                    if (index > 0) --index;
                    break;
                case 'page_next':
                    if (index < pages.length - 1) ++index;
                    break;
                case 'page_last':
                    index = pages.length - 1;
                    break;
            }

            page_count.setLabel(`${index + 1}/${pages.length}`); // update the label

            if (index === 0)
            {
                first.setDisabled(true);
                prev.setDisabled(true);
            }
            else
            {
                first.setDisabled(false);
                prev.setDisabled(false);
            }

            if (index === pages.length - 1)
            {
                next.setDisabled(true);
                last.setDisabled(true);
            }
            else
            {
                next.setDisabled(false);
                last.setDisabled(false);
            }

            await msg.edit({ embeds: [pages[index]], components: [buttons] }).catch(err => {});

            collector.resetTimer();
        });

        collector.on('end', async () => {
            await msg.edit({ embeds: [pages[index]], components: [] }).catch(err => {});
        });

        return msg;
    }
    catch (err)
    {
        console.error(`ERROR :: ${err}`);
    }
}