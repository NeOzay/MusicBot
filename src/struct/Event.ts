import { Client2 } from "./../client"

export interface Event {
	name: string;
	execute: (
		client: Client2,
		...args: any[]
	) => Promise<unknown | void> | unknown | void;
}
