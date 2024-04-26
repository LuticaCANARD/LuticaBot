
export type DiscordCommandType = {
	id : string|number,	//Unique ID of command	all
	type?	: DiscordCommandTypePermissionsNumber,
	application_id : string|number,	//snowflake	ID of the parent application	all
	guild_id?: string|number,	//snowflake	Guild ID of the command, if not global	all
	name : string	//Name of command, 1-32 characters	all
	name_localizations?:DiscordLanguageSupport,//	?dictionary with keys in available locales	Localization dictionary for name field. Values follow the same restrictions as name	all
	description :string, //	Description for CHAT_INPUT commands, 1-100 characters. Empty string for USER and MESSAGE commands	all
	description_localizations?:DiscordLanguageSupport,//?dictionary with keys in available locales	Localization dictionary for description field. Values follow the same restrictions as description	all
	options?: DiscordCommandOptions[],	//array of application command option	Parameters for the command, max of 25	CHAT_INPUT
	default_member_permissions? : string,//	Set of permissions represented as a bit set	all
	dm_permission? : boolean,//Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible.	all

	nsfw?:boolean //	Indicates whether the command is age-restricted, defaults to false	all
	version : snowflake	//Autoincrementing version identifier updated during substantial record changes	all
}
export type snowflake = string|number

export type DiscordLanguageSupport = {

}

export type DiscordCommandOptions ={
	type : DiscordCommandOptionsTypeNumber,
	name : string	,//1-32 character name
	name_localizations?: DiscordLanguageSupport, //?dictionary with keys in available locales	Localization dictionary for the name field. Values follow the same restrictions as name
	description : string , //1-100 character description
	description_localizations?: DiscordLanguageSupport //?dictionary with keys in available locales	Localization dictionary for the description field. Values follow the same restrictions as description
	required? : boolean , //	If the parameter is required or optional--default false
	choices? : DiscordCommandChoices[]// array of application command option choice	Choices for STRING, INTEGER, and NUMBER types for the user to pick from, max 25
	options? : DiscordCommandOptions, //array of application command option	If the option is a subcommand or subcommand group type, these nested options will be the parameters
	channel_types? :DiscordChannelTypes[] //array of channel types	If the option is a channel type, the channels shown will be restricted to these types
	min_value? : number//integer for INTEGER options, double for NUMBER options	If the option is an INTEGER or NUMBER type, the minimum value permitted
	max_value? : number	//integer for INTEGER options, double for NUMBER options	If the option is an INTEGER or NUMBER type, the maximum value permitted
	min_length? : number	//integer	For option type STRING, the minimum allowed length (minimum of 0, maximum of 6000)
	max_length? : number	//integer	For option type STRING, the maximum allowed length (minimum of 1, maximum of 6000)
	autocomplete? : boolean //*	boolean	If autocomplete interactions are enabled for this STRING, INTEGER, or NUMBER type option
}

export enum DiscordChannelTypes {
	GUILD_TEXT=0,	//a text channel within a server
	DM=1,	//a direct message between users
	GUILD_VOICE=2	,//a voice channel within a server
	GROUP_DM=3,	//a direct message between multiple users
	GUILD_CATEGORY=4,	//an organizational category that contains up to 50 channels
	GUILD_ANNOUNCEMENT=5,	//a channel that users can follow and crosspost into their own server (formerly news channels)
	ANNOUNCEMENT_THREAD=10,	//a temporary sub-channel within a GUILD_ANNOUNCEMENT channel
	PUBLIC_THREAD=11,	//a temporary sub-channel within a GUILD_TEXT or GUILD_FORUM channel
	PRIVATE_THREAD=12,	//a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the MANAGE_THREADS permission
	GUILD_STAGE_VOICE=13,	//a voice channel for hosting events with an audience
	GUILD_DIRECTORY=14,	//the channel in a hub containing the listed servers
	GUILD_FORUM=15	//Channel that can only contain threads
}

export type DiscordCommandChoices = {
	"name": string,
	name_localizations? : DiscordLanguageSupport,
	"value": string
}

export enum DiscordCommandTypePermissionsNumber {
	CHAT_INPUT = 1,
	USER  = 2,
	MESSAGE = 3
}

export enum DiscordCommandOptionsTypeNumber {
	SUB_COMMAND = 1	,
	SUB_COMMAND_GROUP = 2	,
	STRING = 3,
	INTEGER	= 4,//Any integer between -2^53 and 2^53
	BOOLEAN = 5	,
	USER = 6 ,
	CHANNEL	= 7,	//Includes all channel types + categories
	ROLE = 8,
	MENTIONABLE = 9	,//Includes users and roles
	NUMBER = 10,	//Any double between -2^53 and 2^53
	ATTACHMENT = 11,	//attachment object
}

type DiscordUserType = {
	"id": string,
	"username": string,
	"avatar": string,
	"discriminator": string,
	"public_flags": number
}
type DiscordMemberType={
	"user": DiscordUserType,
	"roles": string[],
	"premium_since"?: string|null,
	"permissions": string,
	"pending": boolean,
	"nick"?: string|null,
	"mute": boolean,
	"joined_at": string|Date,
	"is_pending": boolean,
	"deaf": boolean
}
type DiscordResponceDataType = {
	"options": DiscordCommandOptions[],
	"type": DiscordCommandOptionsTypeNumber,
	"name": string,
	"id": number
}



export type DiscordCommandResponseType = {
	"type": 2,
	"token": string,
	"member":DiscordMemberType,
	"id": string|number,
	"guild_id": string|number,
	"app_permissions": string|number,
	"guild_locale": string,
	"locale": string,
	"data": DiscordResponceDataType,
	"channel_id": string|number
}


// For authorization, you can use either your bot token
//headers = {
//	"Authorization": "Bot <my_bot_token>"
//}

// or a client credentials token for your app with the applications.commands.update scope
//headers = {
//	"Authorization": "Bearer <my_credentials_token>"
//}

/**
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
 * 
 * 
 */

export type DiscordCommandMeta = {
	names : string // Discord에 표시될 이름
	description : string // 설명
	execute : Function
}