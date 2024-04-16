import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType ,GuildMemberRoleManager } from 'discord.js';
import { db } from '../../../utils/db/db'
import { administer_role_id } from '../../discordPref';
export default {
	data: new SlashCommandBuilder()
		.setName('카지노등록')
		.setDescription('카지노 DB에 등록합니다.')
		.addStringOption(option =>
			option.setName('직원')
				.setDescription('직원 종류')
				.setRequired(true)
				.addChoices(
					{ name: '인턴', value: 'intern' },
					{ name: '정직원', value: 'mamber' }
				)
		)
		.addUserOption(option =>option
			.setName("디스코드")
			.setDescription("멤버의 디스코드(멘션)")
			.setRequired(true)
			)

		.addStringOption(option=>option
			.setName("이름")
			.setDescription("멤버의 별명")
			.setRequired(true)
			)
		.addBooleanOption(opt=>opt
			.setName("탈퇴")
			.setDescription("지정한 멤버를 탈퇴합니다.")
		)
			
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		const argu = interaction.options.data
		const id = new Map()
		argu.forEach(i => id.set(i.name,i.value))
		const administer = interaction.member?.roles;
		const admin_id = administer_role_id;
		if(id.get("탈퇴")&&(interaction.user.id==id.get("디스코드"))){
			await db.deleteFrom("CasinoMember").where("CasinoMember.userId","=",id.get("디스코드")).execute();
			await interaction.reply({content:`<@${id.get("디스코드")}>님의 자진탈퇴를 확인하였습니다.`});
			return;
		}
		if(administer instanceof GuildMemberRoleManager ) {
			const j  = administer.cache.find(r=>r.id==admin_id)
			if(!j){
					await interaction.reply({ content: '관리자가 아닙니다. 이 명령은 관리자만 가능합니다.', ephemeral: true });
					return;
				}

		}else{
			const j = administer?.find(r=>r==admin_id)
			if(!j){
					await interaction.reply({ content: '관리자가 아닙니다. 이 명령은 관리자만 가능합니다.', ephemeral: true });
					return;
				}
		}
		if(id.get("탈퇴")){
			await db.deleteFrom("CasinoMember").where("CasinoMember.userId","=",id.get("디스코드")).execute();
			await interaction.reply({content:`<@${id.get("디스코드")}>님의 탈퇴를 확인하였습니다.`});
			return;
		}

		const read = await db.
		selectFrom("CasinoMember")
		.where("CasinoMember.userId","=",id.get("디스코드"))
		.select("CasinoMember.name")
		.execute();
		const intern = id.get("직원")=='intern';


		if(read.length>0) {
				await db.updateTable("CasinoMember").where("CasinoMember.userId","=",id.get("디스코드")).set({
				"name" : id.get("별명"),
				"intern" : intern
			}).execute()
			await interaction.reply({content:`<@${id.get("디스코드")}>님의 업데이트를 마쳤습니다.`})
		}
		else {
			console.log(id)
			await db.insertInto("CasinoMember")
			.values({
				"userId" : id.get("디스코드"),
				"name" : id.get("별명"),
				"intern" : intern
			}).execute()
			await interaction.reply({content:`<@${id.get("디스코드")}>님! 카지노 멤버로 오신걸 환영합니다!`})
		}
	

		
		//if(read.length>0) await db.updateTable("CasinoChat").set({"chatId":Number(p.id)}).where("CasinoChat.id","=",Number(p.guildId)).execute();
		//else await db.insertInto("CasinoChat").values([{"id" : Number(p.guildId),"chatId":Number(p.id)}]).execute();*/
	}
	
}; 