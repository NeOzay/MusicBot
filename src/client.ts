import fs, {existsSync, readFileSync} from "node:fs"
import { ClientOptions, Collection } from "discord.js";

import { Client } from "discord.js";
import {token} from "./.token.json" 

import config from "./config.json"
import { Command } from "./struct/Command";
import path from "node:path";

export class Client2 extends Client {
  commands: Collection<string, Command>;
  prefix!: Map<string, string>;
  config = config
  constructor(option: ClientOptions){
    super(option)
    this.commands = new Collection()
    if (config.prefixPath == "") {
      config.prefixPath = path.join(__dirname, 'prefixDB.json');
    }
    let prefixDB
    if (existsSync(config.prefixPath)) {
      prefixDB = require(config.prefixPath)
    }
    this.prefix = new Map(prefixDB && Object.entries(prefixDB))
  }
}

const client = new Client2({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });
client.login(token);

export default client
