import { MessageReaction, ReactionCollector, SlashCommandBuilder, User } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
import {db} from '../../../utils/db/db'
import { checkAdmin } from '../../Utils/Admincheck';
import { botDiscordId } from '../../../utils/constant';
import { getCasinoRoles } from '../../../model/CasinoRole';

export default {
	data: new SlashCommandBuilder()
		.setName('테테테테테테테테')
		.setDescription('카지노에 참가할 인원을 체크합니다. \n 이벤트 개시 24시간 이전에 시도하십시오.')
		.addStringOption(opt=>opt
			.setName("글").setDescription("공지쓰면서 쓸 글입니다."))
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
		let content = '이번주 카지노 참가자 확인합니다!\n 참가하실 분은 ✨ 이모지를 눌러주세요!'
		const p = await interaction.reply({ content , fetchReply: true })
		await p.react('✨') // 참가하는 이모지
		await p.react('✅') // 다음 스텝으로 넘어가는 이모지 (관리자용)
		await p.react('❌') // 스텝을 종료하는 이모지 (관리자용)

        const adminFilter = (reaction:MessageReaction, user:User) =>{
            return ( reaction.emoji.name === '✅' || reaction.emoji.name === '❌' ) 
                && user.id === interaction.user.id
        }
        let step = false;
		const collector = p.createReactionCollector({ filter:adminFilter, time: 24 * 60 * 60_000 })
        collector.on('collect', async (reaction, user) => {
            step = true;
            collector.stop()
            if(reaction.emoji.name === '✅') {
                const dataUsers = await p.reactions.cache.get('✨')?.users.fetch();
                const users = dataUsers?.filter( u => u !== undefined && u.id !== botDiscordId && u.id !== interaction.user.id).map(user => {return {
                    id:user.id,
                    userName:user.displayName,
                }});
                if(users === undefined || users.length < 0) {
                    await p.channel.send('오늘은 진행하지 않습니다...');
                    return;
                }
                const roleList = await getCasinoRoles(String(interaction.guildId));
    
                const roles = await getRoleDisplayString(roleList);
                const roleMessage = await p.channel.send(roles.str);
                for(let i = 0; i < roles.len; i++){
                    await roleMessage.react(`${(roleList[i].Priority)%(roles.len+1)}\u20E3`);
                }
                await roleMessage.react('✅') // 다음 스텝으로 넘어가는 이모지 (관리자용)
                await roleMessage.react('❌');
                const roleCollector = roleMessage.createReactionCollector({ filter:adminFilter, time: 24 * 60 * 60_000 });
                await roleShuffle(roleCollector,users,roleList);
                
            } else if(reaction.emoji.name === '❌') {
                await p.channel.send('오늘은 진행하지 않습니다...');
            }
        });
        collector.on('end', collected => {
            if(step === false) p.channel.send('다시 진행하세요...').then();
        });
        
	}
	
}; 

const getRoleDisplayString = async(roles:{
    Priority: number;
    RoleName: string;
}[]) =>{
    const display = roles.filter(r=>!r.RoleName.endsWith('2'));
    let str = '```';
    for(let i = 0; i < display.length; i++){
        str += `${i + 1} : ${display[i].RoleName}\n`;
    }
    str += '```';
    return {str,len:display.length};
}

const roleShuffle = async (roleControl:ReactionCollector, userList :  {
    id: string;
    userName: string;
}[] | undefined,roles:{
    Priority: number;
    RoleName: string;
}[]) =>{
    let step = false;
    roleControl.on('collect', async (reaction, user) => {
        if(reaction.emoji.name === '✅') {
            const userMap = new Map<string,string>();
            if(userList === undefined) 
            {
                roleControl.message.channel.send('ERROR ! code 200').then();
                roleControl.stop();
                return;
            };
            for(const u of userList){
                userMap.set(u.id,u.userName);
            }
            const choices = roleControl.message.reactions.cache.filter(r => r.emoji.name !== '✅' && r.emoji.name !== '❌');
            for(const r of roles){
                const choice = choices.get(`${(r.Priority)%(roles.length+1)}\u20E3`);
                
                if(choice === undefined) {
                    roleControl.message.channel.send('ERROR ! code 201' + r.Priority).then();
                    roleControl.stop();
                    return;
                }
                const users = await choice.users.fetch();
                const user_ = users.filter(u => u !== undefined && u.id !== botDiscordId && u.id !== user.id).random();
                if(user === undefined) {
                    roleControl.message.channel.send('ERROR ! code 202').then();
                    roleControl.stop();
                    return;
                }
                
            }
        } else if(reaction.emoji.name === '❌') {
            roleControl.message.channel.send('종료합니다...').then();
        }
        roleControl.stop();
    });
    roleControl.on('end', collected => {
        if(step === false) roleControl.message.channel.send('다시 진행하세요...').then();
    });
};