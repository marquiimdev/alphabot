const Discord = require("discord.js");
const pesquisa = require("yt-search");
const ytdl = require("ytdl-core");
exports.run = (client, message, args, ops) => {
    if (!message.member.voice.channel) return message.reply("entre em um canal de voz.");

    let pesq = args.join(" ");
    if (!pesq) return message.reply("digite um vídeo válido.");
    pesquisa(pesq, async function(e, res) {
        if (e) console.log(e);

        let videos = res.videos;
        let rVideo = videos[0];

        let data = ops.active.get(message.guild.id) || {};
        if (!data.connection) data.connection = await message.member.voice.channel.join();
        if (!data.fila) data.fila = new Array();
        data.guildID = message.guild.id;

        data.fila.push({
            titulo: rVideo.title,
            url: rVideo.url,
            views: rVideo.views,
            tempo: rVideo.duration.timestamp,
            author: message.author.tag
        });

        if (!data.dispatcher) tocar(client, ops, data);
        else {
            message.channel.send(`Adicionado a fila: ${rVideo.title}\nPedido por: ${message.author.tag}.`)
        }

        ops.active.set(message.guild.id, data)
    });

    async function tocar(client, ops, data) {
        let embed = new Discord.MessageEmbed()
        .setDescription(`Tocando agora: ${data.fila[0].titulo}\nDuração: ${data.fila[0].tempo}\nAuthor: ${data.fila[0].author}`)
        .setColor("#36393F");
        message.channel.send(embed);

        data.dispatcher = await data.connection.play(ytdl(data.fila[0].url, {filter: 'audioonly'}));
        data.dispatcher.guildID = data.guildID;

        data.dispatcher.on('finish', () => {
            finalizar(client, ops, this);
        });
    };

    async function finalizar(client, ops, dispatcher) {

        let fetched = ops.active.get(dispatcher.guildID);

        await fetched.fila.shift();
        
        if (fetched.fila.length > 0) {
            ops.active.set(dispatcher.guildID, fetched);
            tocar(client, ops, fetched);

        } else { 
            ops.active.delete(dispatcher.guildID);
            let vc = client.guilds.get(dispatcher.guildID).me.voice.channel;
            if (vc) vc.leave;

        }   
    };
};