import { ServerQueue } from "../ServerQueue";
import { Command } from "../struct/Command";
import { checkChannelAndPerm } from "../utils";

const command: Command = {
	name: "play",
	aliases: [],
	permissions: [],
	async execute(message, args) {
		if (!checkChannelAndPerm(message)) return

		const sq = ServerQueue.getServerQueue(message.guildId);
		if (!sq) {
			new ServerQueue(message)
		} else {
			const song = await sq.addSong(args[1])
			message.channel.send(`**${song.title}** has been added to the queue!`);
		}
	}
}

export default command
