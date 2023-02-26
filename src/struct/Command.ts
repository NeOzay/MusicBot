import { Message, PermissionFlags } from "discord.js";

export interface Command {
	name: string
	desciption?: string
	permissions?: PermissionFlags[]
	cooldown?: number
	aliases: string[]
	execute: (message:Message, args:string[]) => void,
}
