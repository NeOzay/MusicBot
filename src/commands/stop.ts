import { ServerQueue } from "../ServerQueue";
import { Command } from "../struct/Command";

const command: Command = {
	name: "stop",
  aliases: [],
	permissions: [],
	async execute(message) {
    const sq = ServerQueue.getServerQueue(message.guildId)
    if (sq) {
      sq.stop()
      message.channel.send("Bot interompu!")
      console.log("Bot interompu!")
    } else {
      message.channel.send(`Please add some tracks first`)
    }
	}
}
export default command
