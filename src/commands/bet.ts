import {
  MessageActionRow,
  MessageSelectMenu,
  CommandInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  command: new SlashCommandBuilder()
    .setName("apostar")
    .setDescription("Faça uma aposta nesta rodada."),
  async execute(interaction: CommandInteraction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("bet_id")
        .setPlaceholder("Nothing selected")
        .addOptions([
          {
            label: "Select me",
            description: "This is a description",
            value: "first_option",
          },
          {
            label: "You can select me too",
            description: "This is also a description",
            value: "second_option",
          },
        ])
    );

    await interaction.reply({ content: "Pong!", components: [row] });
  },
};
