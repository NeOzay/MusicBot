import { Events } from "discord.js"
import { Event } from "../struct/Event"

const onReady: Event<Events.ClientReady> = {
  name: Events.ClientReady,
  execute: function(client) {
    console.log("Bot ready")
  }
}

export default onReady