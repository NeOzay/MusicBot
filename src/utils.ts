import { client } from "./client.js"
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
export { getArgs, createEmbed }
