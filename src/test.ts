import { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import client from "./client"

import  { parceCommand } from "./utils"; "./utils"

const player = createAudioPlayer()

client.on('messageCreate', function(message) {
	if (message.author.bot || !message.content.startsWith("§§")) return;
	const [command, args] = parceCommand("§§", message)
	const voiceChannel = message.member!.voice.channel!
	const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guildId!,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
	const recource = createAudioResource("C:\\Users\\colpa\\IdeaProjects\\MusicBot\\bank\\httpswww.youtube.comwatchv=ye5BuYf8q4o.mp3")
	connection.subscribe(player)
	player.play(recource)
})