import dotenv from "dotenv";
import { readdirSync } from "fs";
import { Client, Intents, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (
  typeof DISCORD_TOKEN === "undefined" ||
  typeof DISCORD_CLIENT_ID === "undefined"
) {
  throw new Error();
}

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);
const commands = new Collection();

async function getCommandsFromFolder() {
  const commands = new Collection();
  const files = readdirSync("src/commands").filter((file) =>
    file.endsWith(".ts")
  );

  const results = files.reduce((acc, file) => {
    return [...acc, import(`./commands/${file}`)];
  }, [] as any);

  console.log(await Promise.all(results));
}

(async () => {
  try {
    getCommandsFromFolder();
    readdirSync("src/commands")
      .filter((file) => file.endsWith(".ts"))
      .forEach(async (file) => {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const command = await import(`./commands/${file}`);
        console.log(command);
      });

    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
      body: commands,
    });
  } catch (error) {
    console.error(error);
  }
})();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName) as any;

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) {
    return;
  }

  if (interaction.customId === "bet_id") {
    await interaction.update({
      content: "voce selecionou uma aposta teste!",
      components: [],
    });
  }
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

// Login to Discord with your client's token
client.login(DISCORD_TOKEN);
