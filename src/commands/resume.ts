import { ServerQueue } from "../ServerQueue";
import { Command } from "../struct/Command";

const command: Command = {
  name: "resume",
  aliases: [],
  permissions: [],
  async execute(message) {
    const sq = ServerQueue.getServerQueue(message.guildId)
    if (sq) {
      sq.resume()
      message.channel.send("🟢 Restart the music")
      console.log("Restart the music")
    } else {
      message.channel.send(`Please add some tracks first`)
    }
  }
}

export default command
