import { ServerQueue } from "../ServerQueue";
import { Command } from "../struct/Command";

const command: Command = {
  name: "skip",
  aliases: [],
  permissions: [],
  async execute(message) {
    const sq = ServerQueue.getServerQueue(message.guildId)
    if (sq) {
      sq.skip()
      message.channel.send(`Skip: **${sq.currentSong.title}**`)
      console.log(`Skip: **${sq.currentSong.title}**`)
    } else {
      message.channel.send(`Please add some tracks first`)
    }
  }
}

export default command
