const Discord = require("discord.js");
exports.run = (client, message, args, ops, database) => {
    // Referência de onde fica localizado.
    let dbref = database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`);
    
    dbref.once('value').then(async function(db) {
        let embed = new Discord.MessageEmbed()
        .setAuthor(`Informações do seu nível, ${message.author.tag}`, message.author.avatarURL())
        .setDescription(`Você está no level ${db.val().level}!\nPróximo nível: (${db.val().xp}/${db.val().level*100}).`)
        .setColor("#36393F");
        message.channel.send(embed);
    })
};