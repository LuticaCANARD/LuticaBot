import { SlashCommandBuilder }from 'discord.js';


export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('pong'),
	async execute(interaction:any) {
		
		await interaction.reply('Pong!');
	}
};