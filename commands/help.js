const Discord = require("discord.js");
exports.run = (client, message, args) => {
    const embed = new Discord.MessageEmbed()
    .setAuthor(`Minha lista de comandos, ${message.author.username}.`, client.user.avatarURL())
    .setDescription(`\`⚒️ Comandos de moderação.\`\n\`🎧 Comandos de música.\`\n\`🥳 Comandos de diversão.\`\n\`🎖️ Comandos variados.\`\`💵 Comandos de economia/level.\`.`)
    .setColor("#36393F")
    message.author.send(embed).then(msg => {
        message.react("📬");
        msg.react(`⚒️`);
        msg.react('🎧');
        msg.react('🥳')
        msg.react('🎖️');
        msg.react('💵');

        let filtro = (reaction, user) => reaction.emoji.name == "⚒️" && user.id == message.author.id;
        let filtro2 = (reaction, user) => reaction.emoji.name == "🎧" && user.id == message.author.id;
        let filtro3 = (reaction, user) => reaction.emoji.name == "🥳" && user.id == message.author.id;
        let filtro4 = (reaction, user) => reaction.emoji.name == "🎖️" && user.id == message.author.id;
        let filtro5 = (reaction, user) => reaction.emoji.name == "💵" && user.id == message.author.id;

        let coletor = msg.createReactionCollector(filtro, {max: 1});
        let coletor2 = msg.createReactionCollector(filtro2, {max: 1});
        let coletor3 = msg.createReactionCollector(filtro3, {max: 1});
        let coletor4 = msg.createReactionCollector(filtro4, {max: 1});
        let coletor5 = msg.createReactionCollector(filtro5, {max: 1});
    }).catch(e => {
        message.channel.send(`Não enviei a mensagem porque suas mensagens privadas estão desativadas, ative-as e tente novamente, ${message.author}.`)
    });
}; 