const Discord = require("discord.js");
const config = require("../config.json");
exports.run = (client, message, args) => {
    // se membro não tem permissão de bani membros, retorna com a mensagem.
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("você não tem permissão.");
    let userBan = message.mentions.users.first() || client.users.cache.get(args[0]);
    let reasonBan = args.slice(1).join(" ");
    const embedSintaxe = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL())
    .setColor("#36393F")
    .setDescription(`Para executar um ban, utilize: \`${config.prefixo}ban {Usuário} {Motivo}.\``);
    if (!userBan) return message.channel.send(embedSintaxe);
    if (!reasonBan) return message.channel.send(embedSintaxe);
    if (message.guild.members.cache.get(userBan.id).hasPermission("BAN_MEMBERS")) return message.reply("eu não posso banir este membro.")

    const embedConfirm = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURl)
    .setDescription(`Você realmente deseja banir \`${userBan.tag}\`?\n\Motivo: \`${reasonBan}\``)
    .setColor("#36393F");
    message.channel.send(embedConfirm).then(msg => {
        msg.react('✅');
        msg.react('❌');

        let filter = (reaction, user) => reaction.emoji.name == "✅" && user.id == message.author.id;
        let collectorV = msg.createReactionCollector(filter, {max: 1});
        collectorV.on('collect', async function() {
            const embedR = new Discord.MessageEmbed()
            .setAuthor(`Relatório do banimento.`, message.author.avatarURL)
            .setDescription(`Author do ban: \`${message.author.tag}\`\nMotivo do ban: \`${reasonBan}\``)
            .setColor("#36393F");
            msg.edit(embedR)
            await userBan.send(embedR).catch(e => console.log(`Ocorreu um erro no ban de ${userBan.tag} por sua DM estar privada.`))
            message.guild.members.cache.get(userBan.id).ban();
        });

        let filter2 = (reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id;
        let collector2 = msg.createReactionCollector(filter2, {max: 1});
        collector2.on('collect', async function() {
            msg.delete()
            let embedNo = new Discord.MessageEmbed()
            .setDescription(`${message.author.tag} não foi banido.`)
            .setColor("#36393F");
            message.channel.send(embedNo)
        });
    });

};