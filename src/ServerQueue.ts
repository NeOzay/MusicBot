import ytdl from "ytdl-core";
const { getBasicInfo } = ytdl
import { Guild, Message, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, VoiceConnection, AudioPlayer } from '@discordjs/voice';

import {getArgs} from "./utils.js"

const queue:Map<string, ServerQueue> = new Map()

async function getSongInfo(url:string):Promise<songData> {
  const songInfo = await getBasicInfo(url);
  return {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };
}

interface songData {
  title:string
  url:string
}

class ServerQueue {
    voiceChannel: VoiceBasedChannel;
    connection!: VoiceConnection;
    songs: songData[];
    volume: number;
    playing: boolean;
    guild: Guild;
    currentSong: songData;
    textChannel: any;
    player!: AudioPlayer;

  constructor(message:Message) {
    const voiceChannel = message.member!.voice.channel!
    this.textChannel = message.channel
    this.voiceChannel = voiceChannel
    this.songs = []
    this.volume = 5
    this.playing = true
    this.guild = message.guild!
    this.currentSong = {title : "no song", url: ""}
    this.#init(message)
  }
  /** @constructor */
  async #init(message:Message) {
    const args = getArgs(message)

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

    } catch (err:any) {
      console.log(err);
      queue.delete(this.guild.id);
      return message.channel.send(err);
    }
  }

  async addSong(url:string) {
    const song = await getSongInfo(url)
    this.songs.push(song);
    return song
  }
  /**
   * @param {{title: string,url: string}} song 
   */
  #startPlay(song?:songData) {
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
    this.#startPlay(this.songs.shift())
  }

  stop() {
    this.connection.destroy()
    queue.delete(this.guild.id)
  }

  pause() {
    this.player.pause()
  }

  resume() {
    this.player.unpause()
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
        this.textChannel.send("Connection interompu")
        queue.delete(this.guild.id)
        connection.destroy();
      }
    });
    return connection
  }
  static getServerQueue(guildId:string|null) {
    return queue.get(guildId ?? "")
  }
}

export { ServerQueue };
