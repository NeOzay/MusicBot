import { Command } from "../struct/Command";
import client from "../client";
import { writeFile } from "fs";

const command:Command = {
	name: "prefix",
	desciption: "",
	aliases: [],
	permissions: [],
	execute(message, args) {
		if (message.guildId) {
			client.prefix.set(message.guildId, args[0])
			writeFile(client.config.prefixPath, JSON.stringify(Object.fromEntries(client.prefix)), function (err) {})
		}
	},	
}

export default command