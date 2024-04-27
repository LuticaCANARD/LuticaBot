import { db } from "../utils/db/db";
export const getCasinoRoles = async (guildId: string) => { 

    return await db.selectFrom("CasinoRoles")
    .where("CasinoRoles.GuildId","=",guildId)
    .select(["CasinoRoles.RoleName","CasinoRoles.Priority"])
    .orderBy("CasinoRoles.Priority").execute();
}

const internRoles = new Map<string,string>();

export const getInternRoleId = async (guildId:string) =>{
    if(internRoles.get(guildId) === undefined){
        const res = await db.selectFrom("InternRoleId").where("InternRoleId.GuildId","=",guildId).select("InternRoleId.RoleId").execute();
        if(res.length === 0){
            return null;
        }
        internRoles.set(guildId,res[0].RoleId);
    }
    return internRoles.get(guildId);
}