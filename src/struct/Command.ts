import { Message, PermissionFlags } from "discord.js";

export interface Command {
	name: string,
	execute: (message:Message, args:string[]) => void,
	permissions: PermissionFlags[]
	cooldown?: number
  aliases: string[]
}
