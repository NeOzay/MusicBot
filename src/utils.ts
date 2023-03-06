import client from "./client"
import { EmbedBuilder } from "@discordjs/builders";
import { Message } from "discord.js";
import { IMessage } from "./struct/Command";

function getArgs(message: Message) {
	return message.content.split(/\s+/)
}

function parceCommand(prefix: string, message: Message): [string, string[]] {
	const args = message.content.slice(prefix.length).split(/\s+/)
	return [args.shift() ?? "", args]
}

function createEmbed(message: IMessage) {
	const iconURL = (message ? message.author.avatarURL() : client.user?.avatarURL() ?? "") as string
	const exampleEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setAuthor({ name: 'Some name', iconURL: iconURL })
		.setDescription('Some description here')
	return exampleEmbed
}

function checkChannelAndPerm(message: IMessage) {
	if (!(message.member?.voice.channel && message.guild?.members.me)) {
		message.channel.send(
			"You need to be in a voice channel to play music!"
		);
		return false
	}
	
	const voiceChannel = message.member.voice.channel;
	const permissions = voiceChannel.permissionsFor(message.guild.members.me);

	if (!permissions.has("Connect") || !permissions.has("Speak")) {
		message.channel.send(
			"I need the permissions to join and speak in your voice channel!"
		);
		return false
	}
	return true
}

export {
	getArgs,
	createEmbed,
	checkChannelAndPerm,
	parceCommand
}
