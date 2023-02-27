import User from "./User";
import { Channel } from "./Channels";

export async function api_get_all_users(): Promise<User[]> {
	let prom = await fetch('/api/user/info', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})
	let users = await prom.json() as User[]
	console.log("IN FUNCTION:",users)
	return users;
}