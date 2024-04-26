import { SlashCommandBuilder, type Interaction } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType ,GuildMemberRoleManager } from 'discord.js';
import { db } from '../../../utils/db/db'
import { administer_role_id } from '../../discordPref';
import { checkAdmin } from '../../Utils/Admincheck';
import { GetThereIsCasinoMemberByDiscordID, regisCasinoMember } from '../../../model/CasinoMembers';
export default {
	data: new SlashCommandBuilder()
		.setName('인턴')
		.setDescription('인턴을 등록/삭제합니다. \n가입이 안된 멤버는 가입부터 시킵니다!')
		.addStringOption(option =>
			option.setName('옵션')
				.setDescription('옵션 종류')
				.setRequired(true)
				.addChoices(
					{ name: '저장', value: 'save' },
					{ name: '삭제', value: 'delete' }
				)
		)
		.addUserOption(option =>option
			.setName("디스코드")
			.setDescription("멤버의 디스코드(멘션)")
			.setRequired(true)
			)
		.addStringOption(option=>option
			.setName("이름")
			.setDescription("멤버의 별명 (미지정시 디코 닉네임으로 지정됨.)")
			.setRequired(false)
			)			
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		if((await checkAdmin(interaction)) === false) return; // 관리자 전용임.

		const discordArguments = new Map();
		
		for(const discordArgument of interaction.options.data) 
		{
			discordArguments.set(discordArgument.name,discordArgument.value);
		}
		const isNeedSetToIntern = discordArguments.get("옵션") === 'save'
		const userDiscord = discordArguments.get("디스코드")
		// 일단 member 가 있는지부터 조회한다.
		if((await GetThereIsCasinoMemberByDiscordID(userDiscord)).length === 0){
			// member가 없다면 입력부터 한다.
			const insert = await regisCasinoMember(interaction,userDiscord,{
				intern : isNeedSetToIntern,
				name : discordArguments.get("이름")
			})
			await replyInsertResult(interaction,insert.length === 1,userDiscord,isNeedSetToIntern,101) 
		}
		else
		{
			const result = await db.updateTable("CasinoMember").set("CasinoMember.intern",isNeedSetToIntern).where("CasinoMember.userId" , "=", userDiscord).execute();
			await replyInsertResult(interaction,result.length === 1,userDiscord,isNeedSetToIntern,102) 
			
		}
		
	

		
		//if(read.length>0) await db.updateTable("CasinoChat").set({"chatId":Number(p.id)}).where("CasinoChat.id","=",Number(p.guildId)).execute();
		//else await db.insertInto("CasinoChat").values([{"id" : Number(p.guildId),"chatId":Number(p.id)}]).execute();*/
	}
	
}; 

const replyInsertResult = async(interaction:ChatInputCommandInteraction<CacheType>,result:boolean,userDiscord:string,isNeedSetToIntern:boolean,errorCode:number)=>{
	if(result === true){
		const content = isNeedSetToIntern ? `<@${userDiscord}>님의 인턴 등록이 완료되었습니다` : `<@${userDiscord}>님의 인턴 해제가 완료되었습니다`
		await interaction.reply({content})
	} else {
		await interaction.reply({content : "DB 에러입니다 ! " + errorCode})
	}
}