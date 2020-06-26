const Discord = require("discord.js");
const config = require("../config.json");
const ms = require("ms");
const moment = require("moment");
moment.locale('pt-br');
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return;

    const embedSintaxe = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL())
    .setColor("#36393F")
    .setDescription(`Para executar um mute, utilize: \`${config.prefixo}mute {Usuário} {Tempo} {Motivo}.\``);

    let userBan = message.mentions.users.first() || client.users.cache.get(args[0]);
    let timeMute = args[1];
    let reasonBan = args.slice(2).join(" ");

    if (!userBan) return message.channel.send(embedSintaxe);
    if (!reasonBan) return message.channel.send(embedSintaxe);
    if (message.guild.members.cache.get(userBan.id).hasPermission("MANAGE_ROLES")) return message.reply("eu não posso mutar este membro.")

    const embedConfirm = new Discord.MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURl)
    .setDescription(`Você realmente deseja mutar \`${userBan.tag}\`?\nDuração: \`${timeMute}\`\n\Motivo: \`${reasonBan}\``)
    .setColor("#36393F");
    message.channel.send(embedConfirm).then(msg => {

        msg.react('✅');
        msg.react('❌');

        let filter = (reaction, user) => reaction.emoji.name == "✅" && user.id == message.author.id;
        let collectorV = msg.createReactionCollector(filter, {max: 1});
        collectorV.on('collect', async function() {
            const embedR = new Discord.MessageEmbed()
            .setAuthor(`Relatório do mute.`, message.author.avatarURL)
            .setDescription(`Author do mute: \`${message.author.tag}\`\nMotivo do mute: \`${reasonBan}\`\nTermina em: ${moment(timeMute)}`)
            .setColor("#36393F");
            message.channel.send(embedR)
            await userBan.send(embedR).catch(e => console.log(`Ocorreu um erro no mute de ${userBan.tag} por sua DM estar privada.`))

            let cargoMute = message.guild.roles.cache.find(rl => rl.name ==  'Mutado');
            if (!cargoMute) {
                cargoMute = await message.guild.roles.create({
                    data: {
                        name: 'Mutado',
                        color: 'WHITE',
                        permissions: []
                    }
                });

                message.guild.channels.cache.forEach(async function(channel, id) {
                    channel.overwritePermissions([{
                        id: cargoMute.id,
                        deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
                    }]);
                });
            }
            message.guild.members.cache.get(userBan.id).roles.add(cargoMute);

            setInterval(() => {
                message.guild.members.cache.get(userBan.id).roles.remove(cargoMute);
            }, ms(timeMute));
            msg.delete();
        });

        let filter2 = (reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id;
        let collector2 = msg.createReactionCollector(filter2, {max: 1});
        collector2.on('collect', async function() {
            msg.delete()
            let embedNo = new Discord.MessageEmbed()
            .setDescription(`${message.author.tag} não foi mutado.`)
            .setColor("#36393F");
            message.channel.send(embedNo)
        });
    });

};