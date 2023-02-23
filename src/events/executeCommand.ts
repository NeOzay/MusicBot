import { Events, Message } from "discord.js";
import { Event } from "../struct/Event"
import { prefix } from "../config.json"
import { parceCommand } from "src/utils";

const executeCommand: Event = {
  name: Events.MessageCreate,
  execute: async (client, message: Message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;
    const [commandName, args] = parceCommand(message)
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
