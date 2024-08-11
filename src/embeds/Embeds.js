const { embedColors, createEmbed } = require('./EmbedCreator');

// TODO (siqek)
//
// przyda się więcej gotowych embedsów

module.exports =
{
    incorrectParams: 
        createEmbed(embedColors.warning)
        .setTitle("Wprowadzono niepoprawne dane"),

    error: 
        createEmbed(embedColors.error)
        .setTitle("Napotkano błąd podczas wykonywania zapytania"),

    wrongTeacherName: 
        createEmbed(embedColors.warning)
        .setTitle("Wprowadzono niepoprawne nazwisko nauczyciela"),
}