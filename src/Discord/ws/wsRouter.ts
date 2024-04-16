import {Context,TypedSchema,ws,Elysia,ElysiaInstance} from 'elysia'
import {WSTypedSchema,ElysiaWSOptions} from 'elysia/ws'


export const discordWsRouter: ElysiaWSOptions<string, WSTypedSchema<never>, {}> = {
	open(ws){
		ws.send('sss')
	},
	message(ws,message) {
		ws.send(message);
	}
}