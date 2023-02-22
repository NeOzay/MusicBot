import { ServerQueue } from "src/ServerQueue";
import { Command } from "src/struct/Command";
import { checkChannelAndPerm } from "src/utils";

const command: Command = {
	name: "stop",
	permissions: [],
	async execute(message, args) {
		ServerQueue.getServerQueue(message.guildId)?.stop()
	}
}}