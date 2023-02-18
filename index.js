const ytdl = require("ytdl-core");

const Discord = require("discord.js");
const {joinVoiceChannel, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { prefix } = require("./config.json");
const { token } = require("./.token.json")
const { AuditLogOptionsType } = require("discord.js");

const { ServerQueue } = require("./ServerQueue")

const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", ""] });
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
 * @property {{title:string, url:string}} currentSong
 */

/** @type Map<string,ServerQueue> */
const queue = new Map()

action_list = {
  play: execute,
  skip: skip,
  stop: stop,
  pause: pause,
  resume: resume
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const args = getArgs(message)

  const action =  args[0].substring(prefix.length)
  const sq = ServerQueue.getServerQueue(message.guildId)
  if (sq) {
    if (sq[action]) {
      sq[action]()
    } else {
      message.channel.send(`**${action}** n'est pas reconnu comme command`)
    }
  } else {
    new ServerQueue(message)
  }
});

/**
 * @param  {Discord.Message} message
 * @returns string[]
 */
function getArgs(message) {
  return message.content.split(/\s+/)
}

/**
 * @param  {Discord.Message} message
 */
async function execute(message) {
  const serverQueue = queue.get(message.guild.id)
  const args = getArgs(message)
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.guild.members.me);
  if (!permissions.has("Connect") || !permissions.has("Speak")) {
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
      const player = createAudioPlayer()

      queueContruct.connection = connection
      queueContruct.player = player
      connection.subscribe(queueContruct.player)

      connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          // Seems to be a real disconnect which SHOULDN'T be recovered from
          message.channel.send("Connection coupé")
          queue.delete(message.guild.id)
          connection.destroy();
        }
      });
      player.on(AudioPlayerStatus.Idle, () =>{
        play(message, queueContruct.songs.shift());
      })
      //player.on("error", (error) =>{
      //  console.log(error.message)
      //})
      play(message, queueContruct.songs.shift());
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
 * @param {Discord.Message} message
 * @param {{title:string, url:string}} song
 */
function play(message, song) {
  const serverQueue = queue.get(message.guild.id);
  if (!song) {
    serverQueue.connection.destroy();
    message.channel.send("Queue Finish")
    queue.delete(message.guild.id);
    return;
  }
  const player = serverQueue.player
  let resource = createAudioResource(ytdl(song.url, {filter: "audioonly", format:"m4a"}))
  player.play(resource)
  serverQueue.currentSong = song
  serverQueue.textChannel.send(`Start playing: **${song.title}**`)
}

/**
 * @param  {Discord.Message} message
 */
function skip(message) {
  const serverQueue = queue.get(message.guild.id)
  message.channel.send(`Skip: **${serverQueue.currentSong.title}**`)
  play(message.guild, serverQueue.songs.shift())
}
/**
 * @param  {Discord.Message} message
 */
function stop(message) {
  queue.get(message.guild.id).connection.destroy()
  message.channel.send("Connection coupé")
  queue.delete(message.guild.id)
}
/**
 * @param  {Discord.Message} message
 */
function pause(message) {
  const serverQueue = queue.get(message.guild.id)
  serverQueue.player.pause()
  message.channel.send("le Player est en Pause")
}
/**
 * @param  {Discord.Message} message
 */
function resume(message) {
  const serverQueue = queue.get(message.guild.id)
  serverQueue.player.unpause()
  message.channel.send("le Player est Reparti")
}
