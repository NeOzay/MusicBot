import { ServerQueue } from "src/ServerQueue";
import { Command } from "src/struct/Command";

const command: Command = {
	name: "stop",
	permissions: [],
	async execute(message) {
    const sq = ServerQueue.getServerQueue(message.guildId)
    if (sq) {
      sq.skip()
      message.channel.send("Bot interompu!")
    } else {
      message.channel.send(`Please add some tracks first`)
    }
	}
}
export default command
