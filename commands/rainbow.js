exports.run = (client, message, args) => {
    let cargo = message.guild.roles.cache.get('726472510563942521');
    setInterval(() => {
        cargo.setColor('RANDOM')
    }, 100)
};