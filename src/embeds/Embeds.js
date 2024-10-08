const { embedColors, createEmbed } = require('./EmbedCreator');

module.exports =
{
    incorrectParams: 
        createEmbed(embedColors.warning)
        .setTitle("Wprowadzono niepoprawne dane."),

    error: 
        createEmbed(embedColors.error)
        .setTitle("Napotkano błąd podczas wykonywania polecenia."),

    wrongTeacherName: 
        createEmbed(embedColors.warning)
        .setTitle("Wprowadzono niepoprawne nazwisko nauczyciela."),

    noDataToDisplay:
        createEmbed(embedColors.warning)
        .setTitle("Brak danych do wyświetlenia."),
}