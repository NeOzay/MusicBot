import  client  from "./client"
import config from "./config.json"
const { prefix } = config
//const  {prefix}  = require("./config.json")
//const  {token} = require( "./.token.json" )
import fs from 'node:fs';
import path from 'node:path';
import { Events } from "discord.js";
import { ServerQueue } from "./ServerQueue";

const commandsPath = path.join(__dirname, 'commands/');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(commandFiles, commandsPath)

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath).default;
    console.log(command)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on("messageCreate", function (message) {
	if (message.author.bot || !message.content.startsWith(prefix))
		 return;



	const args = getArgs(message);
	const action = args[0].substring(prefix.length);
	const sq = ServerQueue.getServerQueue(message.guildId ?? "");
	if (sq) {
		 if (sq[action]) {
			  sq[action](message);
		 } else {
			  message.channel.send(`**${action}** n'est pas reconnu comme commande`);
		 }
	} else if (action == "play") {
		 new ServerQueue( message );
	} else {
		 message.channel.send(`Utiliser **play** pour lancer le bot`);
	}
});