const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const { joinVoiceChannel, createAudioResource, createAudioPlayer, VoiceConnection, AudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');

/** @type Map<string,ServerQueue> */
const queue = new Map()


/** @param {string} url 
 *  @returns {{title:string, url:string}}
 */
async function getSongInfo(url) {
  const songInfo = await ytdl.getBasicInfo(url);
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };
}

/** @param {discord.message} message 
 *  @returns {string[]}
 */
function getArgs(message) {
  return message.content.split(/\s+/)
}

class ServerQueue {
  /** @param {Discord.Message} message */
  constructor(message) {
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

    const song = getSongInfo(args[1])

    this.textChannel = message.channel
    this.voiceChannel = voiceChannel
    this.connection = null
    /** @type {{title:string, url:string}[]} */
    this.songs = []
    this.volume = 5
    this.playing = true
    this.guild = message.guild
    this.currentSong = null

    queue.set(this.guild, this)
    this.songs.push(song);

    try {
      const connection = this.#joinChannel()
      const player = this.#newPlayer()

      this.connection = connection
      this.player = player
      connection.subscribe(player)

      this.#play(this.songs.shift());

    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  }

  play() {
    this.songs.push(song);
    this.textChannel.send(`${song.title} has been added to the queue!`);
  }
  /**
   * @param {Discord.Message} message
   * @param {{title:string, url:string}} song
   */
  #play(song) {
    if (!song) {
      this.connection.destroy();
      message.channel.send("Queue Finish")
      queue.delete(this.guild.id);
      return;
    }
    const player = this.player
    let resource = createAudioResource(ytdl(song.url, { filter: "audioonly", format: "m4a" }))
    player.play(resource)
    this.currentSong = song
    this.textChannel.send(`Start playing: **${song.title}**`)
  }

  skip() {
    this.textChannel.send(`Skip: **${this.currentSong.title}**`)
    this.#play(this.guild, this.songs.shift())
  }

  stop() {
    this.connection.destroy()
    this.textChannel.send("Connection coupé")
    queue.delete(message.guild.id)
  }

  pause() {
    this.player.pause()
    this.textChannel.send("le Player est en Pause")
  }

  resume() {
    this.player.unpause()
    this.textChannel.send("le Player est Reparti")
  }

  #newPlayer() {
    const player = createAudioPlayer()

    player.on(AudioPlayerStatus.Idle, () => {
      tplay(message, queueContruct.songs.shift());
    })
    //player.on("error", (error) =>{
    //  console.log(error.message)
    //})
    return player
  }
  #joinChannel () {
    const voiceChannel = this.voiceChannel
    var connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        message.channel.send("Connection interompu")
        queue.delete(this.guild.id)
        connection.destroy();
      }
    });
    return connection
  }
  static getServerQueue(guildId){
    return queue.get(guildId)
  }
}
exports.ServerQueue = ServerQueue

