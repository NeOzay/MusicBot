import {client} from "./client.js"

import config from "./config.json" assert {type: "json"}
const { prefix } = config
//const  {prefix}  = require("./config.json")
//const  {token} = require( "./.token.json" )

import { getArgs, createEmbed } from "./util.js"

client.on("messageCreate", (message) => {
  if (message.author.bot || message.channel.id != "1076917563356872775") return
  const exampleEmbed1 = createEmbed(message)
  const exampleEmbed2 = createEmbed()
	message.channel.send({ embeds: [exampleEmbed1,exampleEmbed2] });
})
