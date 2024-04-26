import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
import {db} from '../../../utils/db/db'
import { checkAdmin } from '../../Utils/Admincheck';

export default {
	data: new SlashCommandBuilder()
		.setName('시작')
		.setDescription('카지노에 참가할 인원을 체크합니다.')
		.addStringOption(opt=>opt
			.setName("글").setDescription("공지쓰면서 쓸 글입니다."))
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		
		if(await checkAdmin(interaction) === false) // 관리자용 권한이다.
			return;

		// 이 함수에서는 카지노의 참가인원을 모집하는 글을 올리는 역할을 함,
		let content = '<@everyone> 이번주 카지노 참가자 확인합니다!\n 참가하실 분은 ✨ 이모지를 눌러주세요!'
		if(interaction.options.data[0]?.value!=null) 
			content = String(interaction.options.data[0].value)

		const p = await interaction.reply({ content , fetchReply: true })
		await p.react('✨') // 참가하는 이모지
		await p.react('✅') // 다음 스텝으로 넘어가는 이모지 (관리자용)
		await p.react('❌') // 스텝을 종료하는 이모지 (관리자용)

		p.awaitReactions({time:1000*60*60*24}).then(async collected=>{
			
		});// 최대 24시간까지 대기한다.
		if(p.guildId==null) return;

		const read = await db.
		selectFrom("CasinoChat")
		.where("CasinoChat.guildId","=",p.guildId)
		.select("CasinoChat.chatId")
		.execute();


		if(read.length>0) await db.updateTable("CasinoChat").set({"chatId":p.id}).where("CasinoChat.guildId","=",p.guildId).execute();
		else await db.insertInto("CasinoChat").values([
			{"guildId" : p.guildId,"chatId":p.id}
		]).execute();

		
	}
	
}; 
