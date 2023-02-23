import { ServerQueue } from "../ServerQueue";
import { Command } from "../struct/Command";

const command: Command = {
  name: "pause",
  aliases: [],
  permissions: [],
  async execute(message, args) {
    const sq = ServerQueue.getServerQueue(message.guildId)
    if (sq) {
      sq.pause()
      message.channel.send("🛑 Stopped the music.")
    } else {
      message.channel.send(`Please add some tracks first`)
    }
  }
}

export default command

