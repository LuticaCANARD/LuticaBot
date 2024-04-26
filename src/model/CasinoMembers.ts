import type { Interaction } from 'discord.js';
import { db } from '../utils/db/db';

export const GetCasinoChatters = async(guildId:string) =>{
    return await db.
		selectFrom("CasinoChat")
		.where("CasinoChat.id","=",guildId)
		.select("CasinoChat.chatId")
		.execute();
}

export const GetCasinoRole = async () =>{
    return await db.selectFrom("CasinoRoles")
    .select(["CasinoRoles.RoleName","CasinoRoles.userId","CasinoRoles.Priority"])
    .orderBy("CasinoRoles.Priority").execute();
}
export const GetMemberName = async (memberids:string[])=>{
    return await db.selectFrom("CasinoMember")
    .where("CasinoMember.userId","in",memberids)
    .select(["CasinoMember.name","CasinoMember.userId","CasinoMember.intern"]).execute();
}
export const GetCasinoInternHistory = async(memberids:string[]) =>{
    return await db.selectFrom("CasinoInternHistory")
    .where("CasinoInternHistory.userId","in",memberids)
    .select(["CasinoInternHistory.userId","CasinoInternHistory.RoleName"]).execute();
}
export const GetThereIsCasinoMemberByDiscordID = async(discordId:string) => {
    return await db.selectFrom("CasinoMember")
    .where("CasinoMember.userId","=",discordId).select("CasinoMember.name").execute();
}
/**
 * 카지노에 멤버를 등록합니다.
 * @param interaction 
 * @param memberDiscordId 
 * @param option 인턴여부와 닉네임을 지정할 수 있습니다.
 * @returns 
 */
export const regisCasinoMember = async(interaction:Interaction,memberDiscordId:string,option:memberOptionType = {
    intern : false,
    name : undefined
}) =>{
    
    let regisName = option.name ?? (await interaction.guild?.members.fetch(memberDiscordId))?.displayName ?? '';
    return await db.insertInto("CasinoMember").values({
        "intern" : option.intern ?? false,
        "name" : regisName,
        "userId" : memberDiscordId
    }).execute();
}


/**
 * intern : 인턴 여부
 * name: 닉네임
 */
type memberOptionType = {
    intern?:boolean,
    name? : string
}