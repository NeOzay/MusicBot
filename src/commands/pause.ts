import { ServerQueue } from "src/ServerQueue";
import { Command } from "src/struct/Command";

const command: Command = {
  name: "skip",
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

