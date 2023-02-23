import { Awaitable, ClientEvents, Events } from "discord.js";
import { Client2 } from "./../client"

export interface Event{
	name: Events;
	execute:  <K extends keyof ClientEvents>(
		client: Client2,
		...args: ClientEvents[K]
	) => Awaitable<void>
}

