const ytdl = require("ytdl-core");
const fs = require("fs")
const Discord = require("discord.js");

const {joinVoiceChannel, createAudioResource, createAudioPlayer} = require('@discordjs/voice');

const { prefix } = require("./config.json");
const { token } = require("./.token.json")


const player = createAudioPlayer();

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });

client.login(token);

client.on("messageCreate", (message) => {
	//console.log(message)
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  //const serverQueue = queue.get(message.guildId)
  if (message.content.startsWith(`${prefix}play`)) {
	  message.channel.send("message recu")
    execute(message)
  };
  if (message.content.startsWith(`${prefix}download`)) {
      message.channel.send("download ...")
      const args = message.content.split(/\s+/)
      ytdl(args[1], {filter: "audioonly", format:"m4a"}).pipe(fs.createWriteStream("test.m4a"))
    };
});


