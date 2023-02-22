import { BaseInteraction, ChatInputCommandInteraction, Events } from "discord.js";
import {Event} from "src/struct/Event"

const executeCommand:Event = {
  name:Events.InteractionCreate,
  execute: async (client, interaction:BaseInteraction) =>{
    if (!interaction.isChatInputCommand()) return
    interaction.
  }
}
