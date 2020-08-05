const Discord = require("discord.js");
const client = new Discord.Client()
const config = require("./config.json");
const http = require('http');
const express = require('express');
const app = express();
const firebase = require("firebase");

let firebaseConfig = {
// dados do firebase
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Como meu bot é hospedado na Heroku, isso é para manter ele "ativo".
app.get("/", (request, response) => {
  console.log(".");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://botalplha.herokuapp.com`);
}, 60000);

// Mapa usado nos comandos de música.
let active = new Map();
let ops = { active: active }

//Caso o bot tenha sido iniciado da maneira correta, vai aparecer a mensagem.
client.on('ready', function() {
    console.log(`${client.user.username} iniciado com sucesso.`)
});

// Captcha
client.on('guildMemberAdd', async function(member) {
    // procura o canal com nome captcha.
    const captcha = member.guild.channels.cache.find(ch => ch.name == "captcha");
    // caso não haja, ele ignora o resto do código do captcha.
    if (!captcha) return console.log('Não encontrei um canal de captcha.');

    // É importante que o bot crie o cargo de captcha, a não ser que queira criar e editar as permissões canal por canal.
    let cargoAutenticando = member.guild.roles.cache.find(rl => rl.name == "Autenticando");
    if (!cargoAutenticando) {
        cargoAutenticando = await member.guild.roles.create({data: {
                name: 'Autenticando',
                color: 'AQUA',
                permissions: []
            }
        })

        // O bot pega puxa os canais
        member.guild.channels.cache.forEach(async (channel, id) => {
            // e reescreve as permissões em cada um
            await channel.overwritePermissions([
                {
                   id: cargoAutenticando.id,
                   deny: ['VIEW_CHANNEL'],
                },
                //??? sei lá bixo.
              ], 'pocket.');
        })
        // Isso é para que o bot tenha permissão SOMENTE no canal de captcha.
        captcha.overwritePermissions([{
            id: cargoAutenticando.id,
            allow: 'VIEW_CHANNEL'
        }]);
    };

    //Adicionar o cargo ao membro.
    member.roles.add(cargoAutenticando.id);

    let emotes = ['🍕', '☕', '🍉'];

    // aleatorizar o emote.
    let randomEmote = emotes[Math.floor(Math.random() * (3 - 0)) + 0];

    const embedCaptcha = new Discord.MessageEmbed()
    .setAuthor(`Você é um robô, ${member.user.username}?`, member.user.avatarURL())
    .setDescription(`Clique no \`${randomEmote}\`.`)
    .setColor("#36393F");
    captcha.send(embedCaptcha).then(msg => {
        msg.react('🍕');
        msg.react('☕');
        msg.react('🍉');

        // reaction collector
        let filtro = (reaction, user) => reaction.emoji.name == randomEmote && user.id == member.user.id;
        let coletor = msg.createReactionCollector(filtro, {max: 1});
        coletor.on('collect', function() {
            msg.delete();
            let cargoMembro = member.guild.roles.cache.find(rl => rl.name == "Membro");
            member.roles.remove(cargoAutenticando.id);
            member.roles.add(cargoMembro);
        });
    });

    //canal de boas vindas do servidor.
    const canal = member.guild.channels.cache.find(ch => ch.name === "boas-vindas");
    if (!canal) return console.log('Não existe um canal de boas vindas.');

    const embedBV = new Discord.MessageEmbed()
    .setAuthor(`Seja bem vindo, ${member.user.tag}`, member.user.avatarURL())
    .setDescription(`Leia o canal de regras e tenha uma boa programação.`)
    .setColor("#36393F");
    canal.send(embedBV);
});

client.on('message', function(message) {
    // O bot não coleta xp mensagens privadas ou de outros bots.
    if (message.channel.type == "dm");
    if (message.author.bot) return;

    // Puxando informações da database.
    let dbref = database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`);
    database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`).once('value').then(async function(db) {
        if (db.val() == null) {
            // definindo valores
            dbref.set({
                xp: 0,
                level: 1
            });
        } else {
            // aleatoriza um valor entre 15 e 3 com mínimo 3
            let gerarXP = Math.floor(Math.random() * 15 - 3) + 3;

            // atualiza o valor da database
            dbref.update({
                xp: db.val().xp+gerarXP
            });

            //level up
            if (db.val().level*100 <= db.val().xp) {
                dbref.update({
                    xp: 0,
                    level: db.val().level+1
            });
            
                let spamCh = message.guild.channels.cache.find(ch => ch.name === "spam");
                if (!spamCh) return;

                let embedUp = new Discord.MessageEmbed()
                .setTitle(`Parabéns, ${message.author.tag}.`)
                .setDescription(`Você upou para o level ${db.val().level+1}!`)
                spamCh.send(embedUp);
            }
        }
    });

    //Comandos
    if (!message.content.startsWith(config.prefixo)) return;

    let args = message.content.slice(config.prefixo.length).split(" ");
    let comando = args.shift().toLocaleLowerCase();

    try {
        let arquivoComando = require(`./commands/${comando}.js`);
        arquivoComando.run(client, message, args, ops, database);
    } catch (erro) {
        console.log(erro);
    };
});

client.login(config.token);
