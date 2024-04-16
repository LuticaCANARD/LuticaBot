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