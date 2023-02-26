import { Events } from "discord.js";
import { Event } from "../struct/Event"
import { prefix as defautPrefix } from "../config.json"
import { parceCommand } from "../utils";

const executeCommand: Event<Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  execute: async (client, message) => {
    const prefix = client.prefix.get(message.guildId!) ?? defautPrefix
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const [commandName, args] = parceCommand(prefix, message)
    const command = client.commands.find(function(command, name) {
      if (command.name === commandName || commandName in command.aliases) return true
    })
    
    if (command) {
      command.execute(message, args)
    } else {
      message.channel.send(`**${commandName}** n'est pas reconnu comme commande.\nUtilser **${prefix}help** pour lister toutes les commands disponible.`);
    }
  }
}

export default executeCommand
