const ytdl = require("ytdl-core");

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
	let resource = createAudioResource(ytdl(args[1], {filter: "audioonly", format:"m4a"}))

	player.play(resource)
}
