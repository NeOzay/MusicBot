
import { Client } from "discord.js";
import { json } from "stream/consumers";

import config from "./config.json" assert {type: "json"}
import tokenjson from "./.token.json" assert {type: "json"}
const { prefix } = config
const { token } = tokenjson
//const  {prefix}  = require("./config.json")
//const  {token} = require( "./.token.json" )

import { ServerQueue } from "./ServerQueue.js";
import { getArgs } from "./util.js"

import { exampleEmbed } from "./Embed.js";
import { EmbedBuilder } from "@discordjs/builders";

const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", ""] });

client.login(token);

client.on("messageCreate", (message) => {
  if (message.author.bot) return
  const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setAuthor({ name: 'Some name', iconURL: message.author.avatarURL() })
	.setDescription('Some description here')
	message.channel.send({ embeds: [exampleEmbed] });
})