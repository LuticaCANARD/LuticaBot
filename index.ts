import {executeCommand} from './discordDeployer'
import { Collection,Client, GatewayIntentBits,SlashCommandBuilder,Events, REST, Routes, ChatInputCommandInteraction,Partials  } from "discord.js";
import path from 'node:path';
import fs from 'fs';
executeCommand();
const client = new Client({ 
	intents: 
	[ 
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions
	],
	partials:[Partials.Message, Partials.Channel, Partials.Reaction],
})
const commands = new Collection<string,any>() 
const commandsPath = path.join(__dirname, './src/Discord/command');
const dirs = fs.readdirSync(commandsPath);
for (const dir of dirs){
	if(dir=='Utils') continue;
	const now_path = path.join(commandsPath,'./'+dir);
	const commandFiles = fs.readdirSync(now_path).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(now_path, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.set(command.data.name, command);
		} 
		else if(command.__esModule && 'data' in command.default && 'execute' in command.default ) commands.set(command.default.data.name, command.default);
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on(Events.MessageReactionAdd,async interaction =>{
	// 1. 만약 체크해야 할 대상이 대상 길드에서 왔는지
	// 2. 만약 체크 대상이라면... 처리한다.
	//console.log(interaction)
})





//-----------------
client.login(process.env.DISCORD_BOT_TOKEN).then(function () {
    console.log("LOGIN SUCCESS.");
});