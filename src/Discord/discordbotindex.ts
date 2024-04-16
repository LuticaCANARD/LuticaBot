import * as Utils from '../Utils/utils' // Formally.
import {Context,Handler,Elysia} from 'elysia' // Elysia
import { swagger } from '@elysiajs/swagger'
import nacl from 'tweetnacl'

const discordInit = async (c:Context<any>) =>{
	const PUBLIC_KEY = process.env["PUBLIC_KEY"]
	const signature = String(c.headers["x-signature-ed25519"]);
	const timestamp = String(c.headers["x-signature-timestamp"]);
	const verbody = JSON.stringify(c.body); // rawBody is expected to be a string, not raw bytes

	const isVerified = nacl.sign.detached.verify(
		Buffer.from(timestamp + verbody),
		Buffer.from(signature, 'hex'),
		Buffer.from(PUBLIC_KEY, 'hex')
	);

	if (!isVerified) {
		c.set.status = 401
		return'invalid request signature';
	}
	if(c.body["type"] == 1){
		c.set.status = 200;
		return {
			type:1
		};
	}
	else {
		c.set.status = 500;
		return {
			type:-1
		};
	}

}
/**
 * 
 * {
    "type": 2,
    "token": "A_UNIQUE_TOKEN",
    "member": {
        "user": {
            "id": "53908232506183680",
            "username": "Mason",
            "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432",
            "discriminator": "1337",
            "public_flags": 131141
        },
        "roles": ["539082325061836999"],
        "premium_since": null,
        "permissions": "2147483647",
        "pending": false,
        "nick": null,
        "mute": false,
        "joined_at": "2017-03-13T19:19:14.040000+00:00",
        "is_pending": false,
        "deaf": false
    },
    "id": "786008729715212338",
    "guild_id": "290926798626357999",
    "app_permissions": "442368",
    "guild_locale": "en-US",
    "locale": "en-US",
    "data": {
        "options": [{
            "type": 3,
            "name": "cardname",
            "value": "The Gitrog Monster"
        }],
        "type": 1,
        "name": "cardsearch",
        "id": "771825006014889984"
    },
    "channel_id": "645027906669510667"
}

 */



export const DiscordRouter = (app:Elysia): Elysia => {
	app
	.post('/',discordInit)

	return app;
}  