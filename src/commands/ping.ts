import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/struct/command";

export const command:Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .ar,
  async execute(interaction) {
    await interaction.reply('Pong!');
    interaction.
  }
}

