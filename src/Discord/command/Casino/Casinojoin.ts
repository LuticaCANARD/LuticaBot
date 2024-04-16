import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
import {db} from '../../../utils/db/db'
import { checkAdmin } from '../../Utils/Admincheck';

export default {
	data: new SlashCommandBuilder()
		.setName('카지노체크')
		.setDescription('카지노에 참가할 인원을 체크합니다.')
		.addStringOption(opt=>opt
			.setName("글").setDescription("공지쓰면서 쓸 글입니다."))
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		
		let content = '<@everyone> 이번주 카지노 참가자 확인합니다!'
		if(await checkAdmin(interaction) === false) {
			
			return
		} ;
		if(interaction.options.data[0]?.value!=null) content = String(interaction.options.data[0].value)

		const p = await interaction.reply({ content , fetchReply: true })
		await p.react('✅')
		if(p.guildId==null) return;
		const read = await db.
		selectFrom("CasinoChat")
		.where("CasinoChat.id","=",p.guildId)
		.select("CasinoChat.chatId")
		.execute();

		//console.log('sended'+p.id)
		if(read.length>0) await db.updateTable("CasinoChat").set({"chatId":p.id}).where("CasinoChat.id","=",p.guildId).execute();
		else await db.insertInto("CasinoChat").values([
			{"id" : p.guildId,"chatId":p.id}
		]).execute();

		
	}
	
}; 
