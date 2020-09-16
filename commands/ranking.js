const Discord = require('discord.js');
const meuSet = new Set();
exports.run = async (client, message, args, ops, database) => {
    const db = await database.ref(`Servidores/Levels/${message.guild.id}`).once('value');
    const array = Object.keys(db.val());
    
    array.forEach((e) => { 
        let infoMembro = {
            id: `${e}`, level: db.val()[e].level
        };
        meuSet.add(infoMembro)
    });

     // transformar o set em uma array que pode se organizada
     let pe = Array.from(meuSet);
     // organizando a array, usamos o sort, para resumir, ele pega e compara os membros com base no level do maior pro menor
     let xy = pe.sort(function (a, b) {
         if (a.level < b.level) {
           return 1;
         }
         if (a.level > b.level) {
           return -1;
         }
         // a must be equal to b
         return 0;
     });

     let suaPosicao;
     xy.forEach(async function (membro, indice){
         if (membro.id == message.author.id) {
             suaPosicao = `<a:pesquisa:754766723714121757> Sua posição: **#${indice+1}**.`
         }
     })
 
    // variável definida como uma array
     let x = [];
 
     // essa parte aqui é pra caso tenha menos de 10 membros na database
     //se tem > 10 membros cadastrados no banco de dados

     if (xy.length >= 10) {
         for (y = 0; y < 10; y++) {
             let level = xy.slice(y, y+1).map(a => a.level);
             let id = String(xy.slice(y, y+1).map(a => a.id));
 
             x += `**${y+1}**. ${client.users.cache.get(id).tag} [Level: ${level}].\n`
         }
     // se tiver < de 10 membros no banco de dados
     } else {
         for (y = 0; y < xy.length; y++) {
             let level = xy.slice(y, y+1).map(a => a.level);
             let id = xy.slice(y, y+1).map(a => a.id);
 
             x += `**${y+1}**. <@${String(id)}> [Level: ${level}].\n`
         }
     }
 
     const embed = new Discord.MessageEmbed()
     .setAuthor(`Confira as pessoas com mais níveis, ${message.author.tag}`, message.author.avatarURL())
     .setDescription(`${x}\n${suaPosicao}`)
     .setColor("#36393F");
     message.channel.send(embed);
 
     meuSet.clear();
}
