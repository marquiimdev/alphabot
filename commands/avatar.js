const Discord = require("discord.js");
exports.run = (client, message, args) => {
    let usuario = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!usuario) usuario = message.author;

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Avatar de ${usuario.tag}`, usuario.avatarURL())
    .setImage(usuario.avatarURL())
    .setTitle(`Clique aqui para baixar.`)
    .setURL(usuario.avatarURL())
    .setColor("#36393F");
    message.channel.send(embed)
};