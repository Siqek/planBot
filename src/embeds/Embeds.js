const { embedsTypes, createEmbed } = require('./EmbedCreator');

// TODO (siqek)
//
// przyda się więcej gotowych embedsów

module.exports =
{
    incorrectParams: 
        createEmbed(embedsTypes.warning.id)
        .setTitle("Wprowadzono niepoprawne dane"),

    error: 
        createEmbed(embedsTypes.error.id)
        .setTitle("Napotkano błąd podczas wykonywania zapytania"),

    wrongTeacherName: 
        createEmbed(embedsTypes.warning.id)
        .setTitle("Wprowadzono niepoprawne nazwisko nauczyciela"),
}