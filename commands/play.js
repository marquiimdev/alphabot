const Discord = require("discord.js");
// Troquei o "yt-search" para "youtube-search".
const yts = require('youtube-search');
const ytdl = require('ytdl-core');
const moment = require("moment");
var opts = yts.YouTubeSearchOptions = {
    maxResults: 10,
    key: "youtube api v.3 key"
};
exports.run = (client, message, args, ops) => {
    if (!message.member.voice.channel) return message.reply("entre em um canal de voz.");

    let pesq = args.join(" ");
    if (!pesq) return message.reply("digite um vídeo válido.");

    // função de pesquisa
    yts(pesq, opts, async function(err, res) {
        if (err) console.log(err);
        let a = res[0];

        ytdl.getInfo(a.id,
        async function(err, rVideo) {

            let data = ops.active.get(message.guild.id) || [];

            if (!data.connection) data.connection = await message.member.voice.channel.join();
            if (!data.fila) data.fila = new Array();
            data.guildID = message.guild.id;

            let rTempo = moment.utc(rVideo.length_seconds*1000).format("HH:mm:ss");

            data.fila.push({
                titulo: rVideo.title,
                url: rVideo.url,
                views: rVideo.short_view_count_text,
                tempo: rTempo,
                author: message.author.tag
            });

            if (!data.dispatcher) tocar(client, ops, data);
            else {
                message.channel.send(`Adicionado a fila: ${rVideo.title}\nPedido por: ${message.author.tag}.`)
            }

            ops.active.set(message.guild.id, data)
        });
    });

    // tocar a música
    async function tocar(client, ops, data) {
        let embed = new Discord.MessageEmbed()
        .setDescription(`Tocando agora: ${data.fila[0].titulo}\nDuração: ${data.fila[0].tempo}\nAuthor: ${data.fila[0].author}`)
        .setColor("#36393F");
        message.channel.send(embed);

        data.dispatcher = await data.connection.play(ytdl(data.fila[0].url, {filter: 'audioonly'}));
        data.dispatcher.guildID = data.guildID;

        // Quando a música acabar, ele executa o finalizar();
        data.dispatcher.once('finish', function() {
            finalizar(client, ops, this);
        });
    };

    function finalizar(client, ops, dispatcher) {
        let fetched = ops.active.get(dispatcher.guildID);
        // tira o primeiro item da fila, no caso o que acabou de tocar.
        fetched.fila.shift();
        
        // se ainda tiver algo na fila
        if (fetched.fila.length > 0) {
            ops.active.set(dispatcher.guildID, fetched);
            tocar(client, ops, fetched);

        // se não tiver mais nada na fila, ele sai do canal.
        } else { 
            ops.active.delete(dispatcher.guildID);
            let vc = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
            if (vc) vc.leave();
        }   
    };
};
