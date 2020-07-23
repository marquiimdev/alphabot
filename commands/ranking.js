const Discord = require("discord.js");
// set que vai ficar armazenado as informações
const setMembros = new Set();
exports.run = async function(client, message, args, ops, database){
    // Pegar somente os membros cadastrados na database.
    for (var i = 0; i < message.guild.members.cache.size; i++) {

        // basicamente, ele pega todos os membros do servidor e coloca somente os que estão cadastrados na database
        let membro = message.guild.members.cache.map(m => m.user.id).slice(i, i+1);

        let dbMembro = await database.ref(`Servidores/Levels/${message.guild.id}/${membro}`).once('value');
        // se o valor cadastrado NÃO for nulo, ou seja, tiver algo no banco de dados
         if (dbMembro.val() !== null) {
            let idMembro = message.guild.members.cache.map(m => m.user.id).slice(i, i+1);

            // o bot adiciona as informações do membro no set criado acima.

            // são duas informações, id e level
            let infoMembro = {
                id: `${idMembro}`, level: dbMembro.val().level
            };
            setMembros.add(infoMembro);
        }
    }

    // transformar o set em uma array que pode se organizada
    let pe = Array.from(setMembros);
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

    // variável definida como uma array
    let x = [];

    // essa parte aqui é pra caso tenha menos de 10 membros na database
    //se tem > 10 membros cadastrados no banco de dados
    if (xy.length >= 10) {
        for (y = 0; y < 10; y++) {
            let level = xy.slice(y, y+1).map(a => a.level);
            let id = String(xy.slice(y, y+1).map(a => a.id));

            x += `**${y+1}**. ${message.guild.members.cache.get(id).user.tag} [Level: ${level}].\n`
        }
    // se tiver < de 10 membros no banco de dados
    } else {
        for (y = 0; y < xy.length; y++) {
            //pegar o level
            let level = xy.slice(y, y+1).map(a => a.level);
            //pegar a id
            let id = String(xy.slice(y, y+1).map(a => a.id));

            // adicionar coisas a variável criada lá em cima.
            x += `**${y+1}**. ${message.guild.members.cache.get(id).user.tag} [Level: ${level}].\n`
        }
    }

    // O embed com a variável X.
    const embed = new Discord.MessageEmbed()
    .setAuthor(`Confira as pessoas com mais níveis, ${message.author.tag}`, message.author.avatarURL())
    .setDescription(`${x}`)
    .setColor("#36393F");
    // Enviar a mensagem.
    message.channel.send(embed);
}