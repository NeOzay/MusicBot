import  client  from "./client"
import config from "./config.json"
const { prefix } = config
//const  {prefix}  = require("./config.json")
//const  {token} = require( "./.token.json" )
import fs from 'node:fs';
import path from 'node:path';
import { Command } from "./struct/Command";

const commandsPath = path.join(__dirname, 'commands/');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(commandFiles, commandsPath)

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command:Command = require(filePath).default;
    console.log(command)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

