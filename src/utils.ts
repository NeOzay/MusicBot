import client from "./client.js"
import { EmbedBuilder } from "@discordjs/builders";
import { Message } from "discord.js";

function getArgs(message:Message) {
	return message.content.split(/\s+/)
}

function createEmbed(message:Message) {
	const iconURL = ( message ?  message.author.avatarURL() : client!.user!.avatarURL() ) as string
	const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setAuthor({ name: 'Some name', iconURL: iconURL })
		.setDescription('Some description here')
  return exampleEmbed
}

function checkChannelAndPerm(message:Message) {
	const voiceChannel = message.member?.voice.channel;
	if (!voiceChannel) {
		 message.channel.send(
			  "You need to be in a voice channel to play music!"
		 );
		 return false
	}
	const permissions = voiceChannel.permissionsFor(message.guild!.members.me!);

	if (!permissions.has("Connect") || !permissions.has("Speak")) {
		 message.channel.send(
			  "I need the permissions to join and speak in your voice channel!"
		 );
		 return false
	}
	return true
}

export { getArgs, createEmbed, checkChannelAndPerm }
