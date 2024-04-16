import { SlashCommandBuilder,GuildMemberRoleManager } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
import { db } from '../../../utils/db/db'
import { administer_role_id } from '../../discordPref';
import { checkAdmin } from '../../Utils/Admincheck';

export default {
	data: new SlashCommandBuilder()
		.setName('카지노역할등록')
		.setDescription('카지노 DB에 역할을 바꿉니다.')
		.addStringOption(option =>
			option.setName('역할목록')
				.setDescription('역할목록 쉼표로구분 (역할1,역할2,...)')
				.setRequired(true)
		)
			
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		const argus = new Map()
		interaction.options.data.map(a=>argus.set(a.name,a.value))
		if(await checkAdmin(interaction) == false) return ;
		const v = argus.get("역할목록")?.replace(/, /g,',').replace(/ ,/g,',').split(',');
		await db.deleteFrom("CasinoRoles").execute();
		for(let n of v){
			await db.insertInto("CasinoRoles").values({"RoleName":n}).execute()
		}
		await interaction.reply({content:"카지노 역할지정을 완료했습니다!"})
	}
	
}; 