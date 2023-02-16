const ytdl = require("ytdl-core");
const fs = require('fs')

const Discord = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice")
const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"] });

const { prefix } = require("./config.json");
const {token} = require("./.token.json")

const { createAudioResource } = require('@discordjs/voice');

const queue = new Map()

const { createAudioPlayer } = require('@discordjs/voice');
const { error } = require("console");

const player = createAudioPlayer();

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
});


/**
 * @param message {Discord.Message}
 */
async function execute(message, serverQueue) {
  const args = message.content.split(" ")
  const voiceChannel = message.member.voice.channel;
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
  player.on("error", (error) => {
    console.log(error)
  })
	const subscription = connection.subscribe(player);
	let resource = createAudioResource("./test.mp4")

	player.play(resource)
}