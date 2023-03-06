import Playdl, { InfoData } from "play-dl"
import { Guild, Message, TextChannel, VoiceBasedChannel } from "discord.js";
import { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, VoiceConnection, AudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';

import manager from "./SongManager"

const queue: Map<string, ServerQueue> = new Map()

async function getSongInfo(url: string) {
  //const yt_info = await Playdl.video_info(url)
  const yt_info = await Playdl.video_info(url)
  return {
    info: yt_info,
    url: yt_info.video_details.url,
    title: yt_info.video_details.title
  };
}

interface songData {
  info: InfoData
  url: string
  title?: string
}

class ServerQueue {
  voiceChannel: VoiceBasedChannel;
  connection!: VoiceConnection;
  songs: songData[];
  volume: number;
  playing: boolean;
  guild: Guild;
  currentSong!: songData;
  textChannel: TextChannel;
  player!: AudioPlayer;

  constructor(message: Message, url: string) {
    const voiceChannel = message.member!.voice.channel!
    this.textChannel = message.channel as TextChannel
    this.voiceChannel = voiceChannel
    this.songs = []
    this.volume = 5
    this.playing = true
    this.guild = message.guild!

    queue.set(this.guild.id, this)
    this.#init(message, url)
  }
  /** @constructor */
  async #init(message: Message, url: string) {
    await this.addSong(url)
    try {
      const connection = this.#joinChannel()
      const player = this.#newPlayer()

      this.connection = connection
      this.player = player
      connection.subscribe(player)
      this.#startPlay(this.songs.shift());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      queue.delete(this.guild.id);
      return (message.channel as TextChannel).send(err);
    }
  }

  async addSong(url: string) {
    const song = await getSongInfo(url)
    this.songs.push(song);
    return song
  }

  async #startPlay(song?: songData) {
    //
    if (!song) {
      try {
        queue.delete(this.guild.id);
        this.connection.destroy();
        console.log("no song, Queue Finish!")
        this.textChannel.send("Queue Finish!")
      } catch (err) {
        console.log(err)
      }
      return;
    }
    const player = this.player
    //ytdl(song.url, { filter: "audioonly", format: "m4a" })
    //const stream = await Playdl.stream_from_info(song.info)
    const songName = await manager.get(song.url)
    console.log(songName);
    
    const resource = createAudioResource(songName)
    console.log(`start to play "${song.title}"`)
    player.play(resource)
    this.currentSong = song
    this.textChannel.send(`Start playing: **${song.title}**`)
  }

  skip() {
    this.#startPlay(this.songs.shift())
  }

  stop() {
    this.player.stop()
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
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play
      }
    })

    player.on(AudioPlayerStatus.Idle, () => {
      console.log("player stats Idle")
      this.#startPlay(this.songs.shift());
    })
    player.on("error", (error) => {
      console.log("erreur du player");

      console.log(error)
    })
    return player
  }

  #joinChannel() {
    const voiceChannel = this.voiceChannel
    const connection = joinVoiceChannel({
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
    connection.on('stateChange', (old_state, new_state) => {
      console.log('join', 'Connection state change from', old_state.status, 'to', new_state.status)
      if (old_state.status === VoiceConnectionStatus.Ready && new_state.status === VoiceConnectionStatus.Connecting) {
          connection.configureNetworking();
      }
  })
    return connection
  }
  static getServerQueue(guildId: string | null) {
    return queue.get(guildId ?? "")
  }
}

export { ServerQueue };
