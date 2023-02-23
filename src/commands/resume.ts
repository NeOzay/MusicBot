import { ServerQueue } from "src/ServerQueue";
import { Command } from "src/struct/Command";

const command: Command = {
  name: "resume",
  permissions: [],
  async execute(message) {
    const sq = ServerQueue.getServerQueue(message.guildId)
    if (sq) {
      sq.resume()
      message.channel.send("🟢 Restart the music")
    } else {
      message.channel.send(`Please add some tracks first`)
    }
  }
}

export default command
