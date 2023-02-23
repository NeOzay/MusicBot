import { Events } from "discord.js"
import { Event } from "../struct/Event"

const onReady: Event = {
  name: Events.ClientReady,
  execute: function(){}
}
