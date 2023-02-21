import { ClientOptions, Collection } from "discord.js";

import { Client } from "discord.js";
import {token} from "./.token.json" 


class Client2 extends Client {
  commands: Collection<unknown, unknown>;
  constructor(option: ClientOptions){
    super(option)
    this.commands = new Collection()
  }
}

const client = new Client2({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });
client.login(token);



export {client}
