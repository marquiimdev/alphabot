exports.run = (client, message, args) => {
    let cargo = message.guild.roles.cache.get('722944128484245635');
    setInterval(() => {
        cargo.setColor('RANDOM')
    }, 100)
};