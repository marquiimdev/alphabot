exports.run = (client, message, args, ops) => {
    if (ops.active.get(message.guild.id)) ops.active.delete(message.guild.id);
    
    if (!message.member.voice.channel) return message.reply("entre em um canal de voz.");
    if (!message.guild.me.voice.channel) return message.reply("eu não estou tocando nada.")
    if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply("entre no meu canal de voz.");

    message.guild.me.voice.channel.leave();
    message.reply('estou me retirando do canal de voz.')
};