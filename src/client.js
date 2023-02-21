import { Collection } from "discord.js";

import { Client } from "discord.js";
import tokenjson from "./.token.json" assert {type: "json"}
const { token } = tokenjson


class Client2 extends Client {
  constructor(option){
    super(option)
    this.commands = new Collection()
  }
}

const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", ""] });
client.login(token);



export {client}
