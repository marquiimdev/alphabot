const Discord = require('discord.js');
const jimp = require('jimp');
exports.run = async (client, message, args) => {
// Embed
    const embedTuto = new Discord.MessageEmbed()
    .setDescription(`<:aviso:751203502440710195> Use: **a.ship [usuário 1] [usuário 2]**.`)
    .setColor("#36393F");

// Identificando os membros
    if (!args[0] || !args[1]) return message.channel.send(embedTuto);
    let usuario1 = client.users.cache.get(args[0].replace('!', '').replace('<', '').replace('>', '').replace('@', ''));
    
    if (!usuario1) return message.channel.send(embedTuto);
    let usuario2 = client.users.cache.get(args[1].replace('!', '').replace('<', '').replace('>', '').replace('@', ''));

    if (usuario1 == usuario2) return message.reply('você não pode shippar duas pessoas iguais!');

    // Junção do username dos membros shippados.
    let shipname = usuario1.username.slice(0, usuario1.username.length/2)+usuario2.username.slice(usuario2.username.length/2, usuario2.username.length);
    // Porcentagem de dar certo.
    let porcentagem = Math.floor(Math.random() * 100 - 1)+ 1;

    let avatar1 = await jimp.read(usuario1.displayAvatarURL({format: 'png', size: 1024}));
    let avatar2 = await jimp.read(usuario2.displayAvatarURL({format: 'png', size: 1024}));
    let mask = await jimp.read(`./img/mask.png`);
    let fonte = await jimp.loadFont(`./img/05.fnt`)
    let fundo = await jimp.read('./img/heart.png');

    avatar1.resize(320, 320);
    avatar2.resize(320, 320);

    mask.resize(320, 320);
    avatar1.mask(mask);
    avatar2.mask(mask);

    fundo.composite(avatar1, 47, 43);
    fundo.composite(avatar2, 829, 43);
    fundo.print(fonte, 540, 130, `${porcentagem}%`)
    .write('ship.png');

    let emote;
    if (porcentagem < 25) emote = '💔';
    if (porcentagem >= 25) emote = '😳';
    if (porcentagem >= 50) emote = '🥰';
    if (porcentagem >= 75) emote = '😍';
    if (porcentagem >= 90) emote = '❤️';

    message.channel.send(`${emote} O casal \`\`${shipname}\`\` tem ${porcentagem}% de chance de dar certo!`, {files: ['ship.png']})
};
