const ytdl = require("ytdl-core");

const Discord = require("discord.js");
const {joinVoiceChannel, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayer} = require('@discordjs/voice');
const { prefix, token } = require("./config.json");


const client = new Discord.Client({ intents: ["Guilds", "GuildMessages"] });
client.login(token);

/** 
 * @typedef {Object} ServerQueue
 * @property {import("discord.js").Channel} textChannel
 * @property {import("discord.js").VoiceBasedChannel} voiceChannel
 * @property {VoiceConnection} connection
 * @property {{title:string, url:string}[]} songs
 * @property {number} volume
 * @property {AudioPlayer} player
 * @property {boolean} playing
 */

/** @type Map<string,ServerQueue> */
const queue = new Map()

client.on("messageCreate", (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  const serverQueue = queue.get(message.guildId)
  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue)
  };
});

/**
 * @param message {Discord.Message}
 */
async function execute(message, serverQueue) {
  const args = message.content.split(" ")
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getBasicInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    /** @type {ServerQueue} */
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);
    try {
      var connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      queueContruct.connection = connection;
      queueContruct.player = createAudioPlayer()
      connection.subscribe(queueContruct.player)
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

/**
 * @param {Discord.Guild} guild
 * @param {{title:string, url:string}} song
 */
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }
  const player = serverQueue.player
  let resource = createAudioResource(ytdl(song.url, {filter: "audioonly", format:"m4a"}))
  player.play(resource)
}

//const url = "https://m.youtube.com/watch?v=nhePDXNZ0kU"
//ytdl(url).pipe(fs.createWriteStream("test.mp4"))
