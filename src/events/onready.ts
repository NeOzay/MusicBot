import { generateDependencyReport } from "@discordjs/voice"
import { Events } from "discord.js"
import { Event } from "../struct/Event"

const onReady: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute: function(client) {
    console.log("Bot ready")
    console.log(generateDependencyReport())
  }
}

export default onReady