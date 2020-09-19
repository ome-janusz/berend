const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const config = require("./config.json");
const urlRegex = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?")

client.on("ready", () => {
  console.log(`Bot has started as ${client.user.tag}`); 
});

client.on("message", (message) => {
  if (message.member.id != client.user.id
  	&& Date.now() - message.member.joinedTimestamp < config.membershipThreshold
  	&& urlRegex.test(message.content)) {
    message.channel.send(`Gebruikers zonder rollen kunnen geen links plaatsen; de link is zodanig verwijderd`);
    message.delete();
    message.member.kick();
  }
});

client.login(auth.token);
