const jimp = require('jimp');
const meuSet = new Set();
exports.run = async (client, message, args, ops, database) => {
    // Informações do membro
    let usuario = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!usuario) usuario = message.author;

    // Informações do level.
    let db = await database.ref(`Servidores/Levels/${message.guild.id}/${message.author.id}`).once('value');
    // O padrãozinho que eu crio no vídeo
    let coisa = await jimp.read('./level/01.png')

    // avatar do membro
    let avatar = await jimp.read(usuario.displayAvatarURL({format: 'png', size: 1024}));
    // a máscara está no tamanho 1024x1024
    let mask = await jimp.read(`./level/mask.png`);
    let fonte = await jimp.loadFont(`./level/fonte40.fnt`);
    let fundo = await jimp.read('./level/default.png');

    // para a barrinha eu precisei criar 2 barrinhas no photoshop, uma branca e outra azul
    let retangulo01 = await jimp.read('./level/barra01.png');
    let retangulo02 = await jimp.read(`./level/barra02.png`);

    mask.resize(270, 265);
    avatar.resize(270, 265);
    avatar.mask(mask);

    // encontrar a posição do membro na db
    const db1 = await database.ref(`Servidores/Levels/${message.guild.id}`).once('value');
    const array = Object.keys(db1.val());
    
    // Ele mapeia todos os dados e anota no set criado.
    array.forEach((e) => { 
        let infoMembro = {
            id: `${e}`, level: db1.val()[e].level
        };
        meuSet.add(infoMembro)
    });

    // Transformando o set em array para poder organizar usando o sort
     let pe = Array.from(meuSet);
     const organizado = pe.sort(function (a, b) {
         if (a.level < b.level) {
           return 1;
         }
         if (a.level > b.level) {
           return -1;
         }
         return 0;
     });

     // Sua posição de level em relação ao servidor.
     let suaPosicao;
     organizado.forEach(async function (membro, indice){
         if (membro.id == usuario.id) {
             suaPosicao = `${indice+1}`
         }
     })
     // informações do membro
    coisa.print(fonte, 420, 80, db.val().level);
    coisa.print(fonte, 650, 80, `#${suaPosicao}`)
    // ele limpa o set para não bugar depois
    meuSet.clear();

    // Eu uso porcentagem, tendo em conta que é 576 pixels de largura é 100%, ou seja, a barrinha cheia é 576 pixels.
    let porcentagem = (db.val().xp*100)/(db.val().level*100);
    retangulo01.resize(576, 68);
    coisa.composite(retangulo01, 290, 190);

    retangulo02.resize(String(porcentagem).slice(0,4)*576/100, 70);
    retangulo02.mask(retangulo01);

    retangulo02.print(fonte, 20, 5, `${db.val().xp}/${db.val().level*100}`);
    coisa.composite(retangulo02, 290, 190)
    coisa.composite(avatar, 29, 18);
    coisa.print(fonte, 320, 130, usuario.tag);
    fundo.composite(coisa,0,0).write('level.png');

    message.channel.send(``, {files: ['level.png']})
};
