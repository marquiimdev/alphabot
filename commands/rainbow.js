exports.run = (client, message, args) => {
    let cargo = message.guild.roles.cache.get('644181188466049034');
    setInterval(() => {
        cargo.setColor('RANDOM')
    }, 100)
};