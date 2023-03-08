import { Message, PermissionFlags, TextChannel } from "discord.js";

export interface MessageTextBase extends Message<boolean> {
  channel: TextChannel
}

export interface Command {
	name: string
	desciption?: string
	permissions?: PermissionFlags[]
	cooldown?: number
	aliases: string[]
	execute: (message:MessageTextBase, args:string[]) => void,
}
