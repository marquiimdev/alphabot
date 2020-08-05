const Discord = require("discord.js");
exports.run = (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);
    if (!fetched) return message.reply("não existe nada em minha fila.");

    if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.reply("entre no meu canal de voz.");

    let userCount = message.member.voiceChannel.members.size;
    let required = Math.ceil(userCount/2);

    if (!fetched.fila[0].voteSkips) fetched.fila[0].voteSkips = [];
    if (fetched.fila[0].voteSkips.includes(message.member.id)) return message.reply(`você já votou para pular. ${fetched.fila[0].voteSkips.length}/${required} votos necessários.`);

    fetched.fila[0].voteSkips.push(message.member.id);

    ops.active.get(message.guild.id, fetched);

    if (fetched.fila[0].voteSkips.length >= required) {
        const embedSucesso = new Discord.MessageEmbed()
        .setDescription(`A música atual foi pulada com sucesso.`)
        .setColor("#36393F");
        message.channel.send(embedSucesso);

        return fetched.dispatcher.emit('finish');
    }

    message.reply(`você votou para pular a música. ${fetched.fila[0].voteSkips}/${required} votos necessários.`)
};