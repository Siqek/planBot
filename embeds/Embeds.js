const embedCreator = require('./EmbedCreator');

module.exports =
{
    incorrectParams: embedCreator.createEmbed(embedCreator.embedsTypes.warning.id)
        .setTitle("Dane nie zostały podane poprawnie."),
    error: embedCreator.createEmbed(embedCreator.embedsTypes.error.id)
        .setTitle("Napotkano błąd podczas wykonywania zapytania."),
    test0: embedCreator.createEmbed(embedCreator.embedsTypes.messange.id),
    test1: embedCreator.createEmbed(embedCreator.embedsTypes.warning.id),
    test2: embedCreator.createEmbed(embedCreator.embedsTypes.error.id)
}