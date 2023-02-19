import { Client } from "discord.js";
import { json } from "stream/consumers";

import config  from "./config.json" assert {type:"json"}
import tokenjson  from "./.token.json" assert {type:"json"}
const  {prefix}  = config
const  {token}  = tokenjson
//const  {prefix}  = require("./config.json")
//const  {token} = require( "./.token.json" )

import { ServerQueue } from "./ServerQueue.js";
import {getArgs} from "./util.js"

const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", ""] });

client.login(token);


client.on("messageCreate", (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const args = getArgs(message)

  const action =  args[0].substring(prefix.length)
  const sq = ServerQueue.getServerQueue(message.guildId)
  if (sq) {
    if (sq[action]) {
      sq[action](message)
    } else {
      message.channel.send(`**${action}** n'est pas reconnu comme commande`)
    }
  } else if (action == "play") {
    new ServerQueue(message)
  } else {
    message.channel.send(`Utiliser **play** pour lancer le bot`)
  }
});