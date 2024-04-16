import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
import { getDiscordArgus } from '../../Utils/getArugs';

export default {
	data: new SlashCommandBuilder()
		.setName('찬양하기')
		.setDescription('누군가를 찬양합니다')
		.addStringOption(opt=>opt
			.setName("찬양문구").setDescription("찬양 문구입니다.").setRequired(true)
			)
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		const ag = getDiscordArgus(interaction);
		await interaction.reply({
			content: ag.get('찬양문구')
		});
		return;
	}
	
}; 
