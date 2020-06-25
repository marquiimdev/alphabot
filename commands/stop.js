exports.run = (client, message, args, ops) => {
    let data = ops.active.get(message.guild.id) || {};
    if (!data) return message.reply("não estou tocando nada.");
    ops.active.delete(message.guild.id);
    message.member.voice.channel.leave();
};