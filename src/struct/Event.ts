import { Awaitable, ClientEvents, Events } from "discord.js";
import { Client2 } from "../client"

export interface BaseEvent {
	name: keyof ClientEvents;
	execute: (
		client: Client2,
		...args: any
	) => Awaitable<void>
}

export interface Event <K extends keyof ClientEvents>{
	name: keyof ClientEvents;
	execute: (
		client: Client2,
		...args: ClientEvents[K]
	) => Awaitable<void>
}

