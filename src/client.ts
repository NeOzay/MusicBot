import { ClientOptions, Collection } from "discord.js";

import { Client } from "discord.js";
import {token} from "./.token.json" 

import config from "./config.json"
import { Command } from "./struct/Command";

export class Client2 extends Client {
  commands: Collection<string, Command>;
  config = config
  constructor(option: ClientOptions){
    super(option)
    this.commands = new Collection()
  }
}

const client = new Client2({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });
client.login(token);

export default client
