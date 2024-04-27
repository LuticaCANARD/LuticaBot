import { type MessageReaction, type ReactionCollector, SlashCommandBuilder, type User, type ChatInputCommandInteraction , type CacheType, Guild } from 'discord.js';
import {db} from '../../../utils/db/db'
import { checkAdmin } from '../../Utils/Admincheck';
import { botDiscordId,keycapCode } from '../../../utils/constant';
import { getCasinoRoles, getInternRoleId } from '../../../model/CasinoRole';
import { mention } from '../../Utils/discordUtil';
import { DateTime } from 'luxon';
import { getRoleDisplayString } from '../../functions/Casino/roleDisplay';

export default {
	data: new SlashCommandBuilder()
		.setName('뽑기')
		.setDescription('카지노에 참가할 인원을 체크합니다. \n 이벤트 개시 24시간 이전에 시도하십시오.')
		.addStringOption(opt=>opt
			.setName("글").setDescription("공지쓰면서 쓸 글입니다."))
        .addBooleanOption(opt=>opt
            .setName('인턴').setDescription('인턴을 굴리는지에 대한 여부').setRequired(false))
		,
	async execute(interaction:ChatInputCommandInteraction<CacheType>){
        if(await checkAdmin(interaction) === false) return; // 관리자 전용임.
		let content =  '<@everyone> 이번주 카지노 참가자 확인합니다!\n 참가하실 분은 ✨ 이모지를 눌러주세요!'
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
                const intern = interaction.options.getBoolean('인턴') ?? false;
                const userRoles = dataUsers?.map(async (u)=>{
                    return await p.guild?.members.fetch(u.id);
                })
                const internRoleId = await getInternRoleId(String(interaction.guildId));
                const internFilter = intern ? async (u:User)=>{
                        const userfetch = await p.guild?.members.fetch(u?.id);
                        if(userfetch === undefined) return false;
                        return userfetch.roles.cache.has(internRoleId ?? '');
                    } : async (u:User)=>{ 
                        const userfetch = await p.guild?.members.fetch(u?.id);;
                        if(userfetch === undefined) return false;
                        return !userfetch.roles.cache.has(internRoleId ?? '');
                    };
                const users = dataUsers?.filter( async u => u !== undefined && u.id !== botDiscordId && u.id !== interaction.user.id && await internFilter(u) === true).map(getUserMeta);
                if(users === undefined || users.length < 0) {
                    await p.channel.send('오늘은 진행하지 않습니다...');
                    return;
                }
                const roleList = await getCasinoRoles(String(interaction.guildId));
                
                const roles = await getRoleDisplayString(roleList);

                const roleMessageFirst = await p.channel.send('1부 역할 지정...\n'+roles.str);
                for(let i = 0; i < roles.len; i++){
                    await roleMessageFirst.react(`${(roleList[i].Priority)%(roles.len+1)}\u20E3`);
                }
                await roleMessageFirst.react('✅') // 다음 스텝으로 넘어가는 이모지 (관리자용)
                await roleMessageFirst.react('❌');
                roleMessageFirst.createReactionCollector({ filter:adminFilter, time: 24 * 60 * 60_000 })
                .on('collect', async (reaction, user) => {
                    if(reaction.emoji.name === '✅') {
                        // 첫번째 역할 선택의 결과를 저장한다.
                        const firstRole = new Map<string,UserMeta[]>();
                        const choices = roleMessageFirst.reactions.cache.filter(r => r.emoji.name !== '✅' && r.emoji.name !== '❌');
                        for(const r of roleList){
                            const choice = choices.get(`${(r.Priority)%(roleList.length+1)}\u20E3`);
                            if(choice === undefined) continue;
                            const choicer = (await choice.users.fetch()).filter(u => u !== undefined && u.id !== botDiscordId && u.id !== interaction.user.id && users.find(u2=>u2.id !== u.id ) !== undefined).map(getUserMeta);
                            if(choicer.length === 0) continue; 
                            firstRole.set(r.RoleName,choicer);
                        }

                        await roleMessageFirst.delete();
                        const roleMessageSecond = await p.channel.send('2부 역할 지정...\n'+roles.str);
                        for(let i = 0; i < roles.len; i++){
                            await roleMessageSecond.react(`${(roleList[i].Priority)%(roles.len+1)}\u20E3`);
                        }
                        await roleMessageSecond.react('✅') // 다음 스텝으로 넘어가는 이모지 (관리자용)
                        await roleMessageSecond.react('❌');
                        const roleCollector = roleMessageSecond.createReactionCollector({ filter:adminFilter, time: 24 * 60 * 60_000 });
                        await roleShuffle(roleCollector,users,roleList,firstRole,interaction.user.id,intern);
                    } else if(reaction.emoji.name === '❌') {
                        await p.channel.send('오늘은 진행하지 않습니다...');
                    }
                });
            } else if(reaction.emoji.name === '❌') {
                await p.channel.send('오늘은 진행하지 않습니다...');
            }
        });
        collector.on('end', collected => {
            if(step === false) p.channel.send('다시 진행하세요...').then();
        });
        
	}
	
}; 

const roleShuffle = async (roleControl:ReactionCollector, userList :UserMeta[] | undefined,roles:{
    Priority: number;
    RoleName: string;
}[], firstRole:Map<string,UserMeta[]>,manager:string,intern:boolean) =>{
    let step = false;
    roleControl.on('collect', async (reaction, user) => {
        step = true;
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
            const secondRoleMap = new Map<string,UserMeta[]>();
            for(const r of roles){
                const choice = choices.get(`${(r.Priority)%(roles.length+1)}\u20E3`);
                if(choice === undefined) continue;
                const users = await choice.users.fetch();
                const choicer = users.filter(u => u !== undefined && u.id !== botDiscordId && u.id !== user.id && userList.find(u2=>u2.id===u.id) !== undefined).map(getUserMeta);
                if(choicer.length === 0) continue;
                secondRoleMap.set(r.RoleName,choicer);
            }
            // 이제 선택이 끝났다.

            // 이하부터는 역할을 배정하는 과정이다.
            const firstTimeResult = new Map<string,UserMeta>();
            const userUsedFirst = new Map<string,boolean>();
            // 일단 1부에 배정된 사람들은 배정된 역할에 할당한다.
            // 그런데, 두명 이상이 할당된 경우, 역할명 뒤에 2가 붙은 역할로 할당한다.
            for(const [roleName,users] of firstRole){
                firstTimeResult.set(roleName,users[0]);
                userUsedFirst.set(users[0].id,true);
                if(users.length > 1){
                    firstTimeResult.set(roleName+'2',users[1]);
                    userUsedFirst.set(users[1].id,true);
                }
            }
            const firstRandomUserList = userList.filter(u => !userUsedFirst.has(u.id)).sort(()=>Math.random()-0.5);
            let uidx = 0;
            for(const r of roles){
                if(!firstTimeResult.has(r.RoleName)){
                    firstTimeResult.set(r.RoleName,firstRandomUserList[uidx]);
                    uidx++;
                    if(uidx === firstRandomUserList.length) break;
                }
            }

            // 이제 2부를 배정한다.
            // 역할이 지정된 경우를 제외하고, 1부와는 다른 역할을 할당한다.

            // 일단 이하의 경우 지정된 경우이므로, 절대로 건드리지 아니한다.
            const secondTimeResult = new Map<string,UserMeta>();
            const secondUsedMap = new Map<string,boolean>();
            for(const [roleName,users] of secondRoleMap){
                secondTimeResult.set(roleName,users[0]);
                secondUsedMap.set(users[0].id,true);
                if(users.length > 1){
                    secondTimeResult.set(roleName+'2',users[1]);
                    secondUsedMap.set(users[1].id,true);
                }
            }
            
            const secondRandomUserList = userList.filter(u => !secondUsedMap.has(u.id)).sort(()=>Math.random()-0.5);

            uidx = 0;
            for(const r of roles){
                if(!secondTimeResult.has(r.RoleName)){
                    if(secondRandomUserList[uidx] !== undefined && firstTimeResult.get(r.RoleName)?.id === secondRandomUserList[uidx].id) {
                        // 중복 ... !
                        // 이 경우, 다른 역할을 할당한다.
                        let rolename = r.RoleName;
                        do{
                            const randomIdx = Math.floor(Math.random()*roles.length);
                            rolename = roles[randomIdx].RoleName;
                        }
                        while(secondRoleMap.has(rolename) 
                            && secondTimeResult.get(rolename) !== undefined 
                            && firstTimeResult.get(r.RoleName)?.id !== (secondTimeResult.get(rolename)?.id));
                        if(secondTimeResult.get(rolename) !== undefined) {
                            const tmp = secondTimeResult.get(rolename);
                            secondTimeResult.set(rolename,secondRandomUserList[uidx]);
                            if(tmp !== undefined) secondRandomUserList[uidx] = tmp;
                        }
                    }
                    secondTimeResult.set(r.RoleName,secondRandomUserList[uidx]);
                    uidx++;
                    if(uidx === secondRandomUserList.length) break;
                }
            }
            // 이제 역할이 모두 배정되었다.
            // 보여주도록 한다.
            // 보여줄때에는, 멘션 : 역할 \n으로 보여준다.
            let managerMsg = `매니저 : ${mention(manager)}\n`;
            let firstTime = '\n';
            for(const [roleName,user] of firstTimeResult){
                if(user != undefined)
                    firstTime += `${mention(user.id)} : ${roleName}\n`;
            }
            let secondTime = '\n';
            for(const [roleName,user] of secondTimeResult){
                if(user != undefined)
                    secondTime += `${mention(user.id)} : ${roleName}\n`;
            }

            let msg = ''
            msg += DateTime.now().setZone('Asia/Seoul').toFormat('yyyy-MM-dd')+' 카지노 역할 배정 ' + intern ? '(인턴)' : ''+ '\n';
            msg += managerMsg;
            msg += firstTime;
            msg += secondTime;
            
            roleControl.message.channel.send(msg).then();
            // 모든 것이 끝났다.
        } else if(reaction.emoji.name === '❌') {
            roleControl.message.channel.send('종료합니다...').then();
        }
        roleControl.stop();
    });
    roleControl.on('end', collected => {
        if(step === false) 
            roleControl.message.channel.send('다시 진행하세요...').then();
    });
};

const getUserMeta = (user:User):UserMeta => { return {
    id : user.id,
    userName : user.displayName,
}}

type UserMeta = {
    id:string,
    userName:string,
}