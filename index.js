const Discord = require("discord.js");
const client = new Discord.Client()
const config = require("./config.json");
let active = new Map();
let ops = { active: active }

client.on('ready', function() {
    console.log('Alfa iniciado com sucesso!')
});

client.on('guildMemberAdd', function(member) {
    const captcha = member.guild.channels.cache.find(ch => ch.name == "captcha");
    if (!captcha) return console.log('Não encontrei um canal de captcha.');

    let cargoAutenticando = member.guild.roles.cache.find(rl => rl.name == "Autenticando");
    if (!cargoAutenticando) {
        cargoAutenticando = member.guild.roles.create({data: {
                name: 'Autenticando',
                color: 'AQUA',
                permissions: []
            }
        })

        member.guild.channels.cache.forEach((channel, id) => {
            channel.overwritePermissions([{
                id: cargoAutenticando.id,
                deny: ['VIEW_CHANNEL']
            }])
        })
    };

    member.roles.add(cargoAutenticando.id);

    let emotes = ['🍕', '☕', '🍉'];
    let randomEmote = emotes[Math.floor(Math.random() * (3 - 0)) + 0];
    const embedCaptcha = new Discord.MessageEmbed()
    .setAuthor(`Você é um robô, ${member.user.username}?`, member.user.avatarURL())
    .setDescription(`Clique no \`${randomEmote}\`.`)
    .setColor("#36393F");
    captcha.send(embedCaptcha).then(msg => {
        msg.react('🍕');
        msg.react('☕');
        msg.react('🍉');

        let filtro = (reaction, user) => reaction.emoji.name == randomEmote && user.id == member.user.id;
        let coletor = msg.createReactionCollector(filtro, {max: 1});
        coletor.on('collect', function() {
            msg.delete();
            let cargoMembro = member.guild.roles.cache.find(rl => rl.name == "Membro");
            member.roles.remove(cargoAutenticando.id);
            member.roles.add(cargoMembro);
        });
    });


    const canal = member.guild.channels.cache.find(ch => ch.name === "boas-vindas");
    if (!canal) return console.log('Não existe um canal de boas vindas.');

    const embedBV = new Discord.MessageEmbed()
    .setAuthor(`Seja bem vindo, ${member.user.tag}`, member.user.avatarURL())
    .setDescription(`Leia o canal de regras e tenha uma boa programação.`)
    .setColor("#36393F");
    canal.send(embedBV);
});

client.on('message', function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefixo)) return;
    if (message.channel.type == "dm");

    let args = message.content.slice(config.prefixo.length).split(" ");
    let comando = args.shift().toLocaleLowerCase();

    try {
        let arquivoComando = require(`./commands/${comando}.js`);
        arquivoComando.run(client, message, args, ops);
    } catch (erro) {
        console.log(erro);
    };
});

client.login(config.token);