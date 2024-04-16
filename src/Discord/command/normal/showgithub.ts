import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction , CacheType ,GuildMemberRoleManager } from 'discord.js';


export default {
	data: new SlashCommandBuilder()
		.setName('showgithub')
		.setDescription('이 프로젝트가 있는 GitHub을 보여줍니다.'),
	async execute(interaction:ChatInputCommandInteraction<CacheType>) {
		let link = 'https://github.com/LuticaCANARD/CanaRinLab_BackEnd'
		let msg = ` 이 봇의 레포지스트리는 ${link} 입니다.`
		await interaction.reply(msg);
	}
};