const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const config = require("./config.json");
const urlRegex = new RegExp(/([a-zA-Z0-9]+:\/\/)?(\w+:\w+@)?([a-zA-Z0-9.-]+\.[A-Za-z]{2,4})(:\d+)?(\/.*)?/g);

function isSpam(content) {
    return urlRegex.test(content) || config.keywords.find(w => content.toLowerCase().indexOf(w) != -1) ? true : false;
}

function messageShortcut(content) {
    let newContent = content.replace(urlRegex, "(link verwijderd)");
    return newContent.substring(0, Math.min(config.messageShortcutLength, newContent.length));
}

client.on("ready", () => {
  console.log(`Bot has started as ${client.user.tag}`); 
});

client.on("message", (message) => {
  if (message.member.id != client.user.id
    	&& (Date.now() - message.member.joinedTimestamp < config.membershipThreshold
    	  || message.member.roles.cache.size < 2)
    	&& isSpam(message.content)) {
    if (config.hasOwnProperty('notificationChannelId')) {
      client.channels.fetch(config.notificationChannelId)
        .then(channel => channel.send(`Linkspam geplaatst door gebruiker <@${message.member.id}>; ` +
            `gebruiker wordt gekickt.\nBericht: ${messageShortcut(message.content)}...`));
    }
    
    message.channel.send((config.hasOwnProperty('notificationRoleId') ?
        `<@&${config.notificationRoleId}> ` : '') + config.message);
    message.delete();
    message.member.kick();
  }
});

client.on("guildMemberAdd", (member) => {
    if (config.hasOwnProperty('taalbotChannelId')) {
      client.channels.fetch(config.taalbotChannelId)
        .then(channel => channel.send(`?onboard <@${member.id}>`));
    }
});

client.login(auth.token);
