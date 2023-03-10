import ytdl from "ytdl-core";
const { getBasicInfo } = ytdl
import Discord from "discord.js";
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState } from '@discordjs/voice';

import {getArgs} from "./util.js"

/** @type Map<string,ServerQueue> */
const queue = new Map()

async function getSongInfo(url) {
  const songInfo = await getBasicInfo(url);
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };
}

class ServerQueue {
  /** @param {Discord.Message} message */
  constructor(message) {
    this.#init(message)
  }
  /** @param {Discord.Message} message */
  async #init(message) {
    const args = getArgs(message)
    this.textChannel = message.channel
    this.voiceChannel = voiceChannel
    this.connection = null
    /** @type {{title: string,url: string}[]} */
    this.songs = []
    this.volume = 5
    this.playing = true
    this.guild = message.guild
    this.currentSong = null

    const song = await getSongInfo(args[1])

    queue.set(this.guild.id, this)
    this.songs.push(song);

    try {
      const connection = this.#joinChannel()
      const player = this.#newPlayer()

      this.connection = connection
      this.player = player
      connection.subscribe(player)
      this.#startPlay(this.songs.shift());

    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  }

  /** @param {Discord.Message} message */
  async play(message) {
    const url = getArgs(message)[1]
    const song = await getSongInfo(url)
    this.songs.push(song);
    this.textChannel.send(`**${song.title}** has been added to the queue!`);
  }
  /**
   * @param {{title: string,url: string}} song 
   */
  #startPlay(song) {
    if (!song) {
      this.connection.destroy();
      this.textChannel.send("Queue Finish!")
      queue.delete(this.guild.id);
      return;
    }
    const player = this.player
    //ytdl(song.url, { filter: "audioonly", format: "m4a" })
    let resource = createAudioResource(ytdl(song.url, {
      filter: "audioonly",
      format: "m4a",
      highWaterMark: 1 << 62,
      liveBuffer: 1 << 62,
      dlChunkSize: 0, //disabling chunking is recommended in discord bot
      bitrate: 128,
      quality: "lowestaudio",
    }))
    player.play(resource)
    this.currentSong = song
    this.textChannel.send(`Start playing: **${song.title}**`)
  }

  skip() {
    this.textChannel.send(`Skip: **${this.currentSong.title}**`)
    this.#startPlay(this.songs.shift())
  }

  stop() {
    this.connection.destroy()
    this.textChannel.send("Bot interompu!")
    queue.delete(message.guild.id)
  }

  pause() {
    this.player.pause()
    this.textChannel.send("???? Stopped the music.")
  }

  resume() {
    this.player.unpause()
    this.textChannel.send("???? Restart the music")
  }

  #newPlayer() {
    const player = createAudioPlayer()

    player.on(AudioPlayerStatus.Idle, () => {
      this.#startPlay(this.songs.shift());
    })
    player.on("error", (error) =>{
      console.log(error)
    })
    return player
  }
  #joinChannel() {
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
  static getServerQueue(guildId) {
    return queue.get(guildId)
  }
}

export { ServerQueue };