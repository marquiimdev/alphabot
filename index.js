const Discord = require("discord.js");
const client = new Discord.Client()
const config = require("./config.json");
const http = require('http');
const express = require('express');
const app = express();
const firebase = require("firebase");

let firebaseConfig = {
    apiKey: "AIzaSyCnETbYrxHxz7xR4dPyDSxxmSStHlP12_Y",
    authDomain: "alphabotdc.firebaseapp.com",
    databaseURL: "https://alphabotdc.firebaseio.com",
    projectId: "alphabotdc",
    storageBucket: "alphabotdc.appspot.com",
    messagingSenderId: "524110938567",
    appId: "1:524110938567:web:4bd13b620300ee231d19e2"
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

app.get("/", (request, response) => {
  console.log(".");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://botalplha.herokuapp.com`);
}, 60000);

let active = new Map();
let ops = { active: active }

client.on('ready', function() {
    console.log('Alfa iniciado com sucesso.')
});

client.on('guildMemberAdd', async function(member) {
    const captcha = member.guild.channels.cache.find(ch => ch.name == "captcha");
    if (!captcha) return console.log('Não encontrei um canal de captcha.');

    let cargoAutenticando = member.guild.roles.cache.find(rl => rl.name == "Autenticando");
    if (!cargoAutenticando) {
        cargoAutenticando = await member.guild.roles.create({data: {
                name: 'Autenticando',
                color: 'AQUA',
                permissions: []
            }
        })

        member.guild.channels.cache.forEach(async (channel, id) => {
            await channel.overwritePermissions([
                {
                   id: cargoAutenticando.id,
                   deny: ['VIEW_CHANNEL'],
                },
              ], 'pocket.');
        })
        captcha.overwritePermissions([{
            id: cargoAutenticando.id,
            allow: 'VIEW_CHANNEL'
        }]);
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

    if (message.channel.type == "dm");
    if (message.author.bot) return;

    let dbref = database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`);
    database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`).once('value').then(async function(db) {
        if (db.val() == null) {
            dbref.set({
                xp: 0,
                level: 1
            });
        } else {
            let gerarXP = Math.floor(Math.random() * 15 - 3) + 3;

            dbref.update({
                xp: db.val().xp+gerarXP
            });

            //level up
            if (db.val().xp <= db.val().level) {
                dbref.update({
                    xp: 0,
                    level: db.val().level+1
            });
            
                let spamCh = message.guild.channels.find(ch => ch.name === "spam");
                if (!spamCh) return;

                let embedUp = new Discord.MessageEmbed()
                .setTitle(`Parabéns, ${message.author}.`)
                .setDescription(`Você upou para o level ${db.val().level}!`)
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