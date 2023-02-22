import { Events, Message, PermissionResolvable } from "discord.js";
import { Client2 } from "src/client";
import {Event} from "src/struct/Event"

interface EventMessage extends Event   {
  checkPermissions: (
    client: Client2,
    message: Message,
    permissions: PermissionResolvable,
  ) => Promise<boolean>;
}

const MessageEvent: EventMessage = {
	name: Events.MessageCreate,
	checkPermissions: async (client, message, permissions) => {
		const hasPermission =
			message.member?.permissions.has(permissions);

		if (!hasPermission) {
			await message.channel.send(
				`Bu komutu kullanabilmek için \`${permissions.toString()}\` yetkilerine ihtiyacın var.`,
			);

			return true;
		}

		return false;
	},
	execute: async (client, message: Message) => {
		if (
			message.author.bot ||
			!message.guild ||
			!message.content ||
			!message.content.startsWith(client.config.prefix)
		)
			return;

		const [commandName, ...args] = message.content
			.slice(client.config.prefix.length)
			.trim()
			.split(/\s+/g);
		const command = client.commands.find((cmd) =>
			cmd.aliases.includes(commandName),
		);
		if (!command) return;

		if (
			await MessageEvent.checkPermissions(
				client,
				message,
				command.permissions,
			)
		)
			return;
		if (await MessageEvent.checkCooldown(client, message)) return;

		await command.execute({
			client,
			message,
			args: bargs(command.argsDefinitions, args),
		});
	},
};

export default MessageEvent;

