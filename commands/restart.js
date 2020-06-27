const config = require("../config.json");
exports.run = (client, message, args, ops) => {
    if (ops.active.get(message.guild.id)) ops.active.delete(message.guild.id);
    if (message.author.id !== "454275898582106115") return;

    console.clear();
    client.destroy()
    client.login(config.token);
    message.author.send("Reiniciado.");
};