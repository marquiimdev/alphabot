const Discord = require("discord.js");
exports.run = (client, message, args, ops, database) => {
    let membro = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!membro) membro = message.author;
    // Referência de onde fica localizado.
    let dbref = database.ref(`Servidores/Levels/${message.guild.id}/${membro.id}`);
    
    dbref.once('value').then(async function(db) {
        if (db.val() == null) return message.reply("esse usuários não se encontra no meu banco de dados.");
        
        let embed = new Discord.MessageEmbed()
        .setAuthor(`Informações do nível, ${membro.user.tag}`, membro.user.avatarURL())
        .setDescription(`Você está no level ${db.val().level}!\nExperiência pro próximo nível: (${db.val().xp}/${db.val().level*100}).`)
        .setColor("#36393F");
        message.channel.send(embed);
    })
};