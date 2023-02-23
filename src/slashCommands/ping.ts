import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../struct/SlashCommand";

const command:SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  }
}

export default command