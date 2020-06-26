exports.run = (client, message, args, ops) => {
    if (!message.member.voice.channel) return message.reply("entre em um canal de voz.");
    if (!message.guild.me.voice.channel) return message.reply("eu não estou tocando nada.")
    if (!message.member.voice.channel !== message.guild.me.voice.channel) return message.reply("entre no MEU canal de voz.");

    message.guild.me.voice.channel.leave();
};