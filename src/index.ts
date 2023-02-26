import client from "./client"

import fs from 'node:fs';
import path from 'node:path';
import { Command } from "./struct/Command";
import { BaseEvent } from "./struct/Event";

const commandsPath = path.join(__dirname, 'commands/');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
//console.log(commandFiles, commandsPath)

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command: Command = require(filePath).default;
	if (!(typeof command === "object" && "name" in command && "execute" in command)) { console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`); continue }

	client.commands.set(command.name, command);

}

const eventsPath = path.join(__dirname, 'events/');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
//console.log(eventsFiles, eventsPath)

for (const file of eventsFiles) {
	const filePath = path.join(eventsPath, file);
	const event: BaseEvent = require(filePath).default;
	//console.log(event)
	if (!("name" in event && "execute" in event && "once" in event)) { console.log(`[WARNING] The event at ${filePath} is missing a required "data" or "execute" property.`); continue }

	if (event.once) {
		client.once(event.name, function (...args) {
			//console.log("event trigger")
			event.execute(client, ...args)
		})
	} else {
		client.on(event.name, function (...args) {
			//console.log("event trigger")
			event.execute(client, ...args)
		})
	}
}
