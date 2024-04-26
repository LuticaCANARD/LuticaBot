import { db } from "../utils/db/db";
const adminRoles = new Map<string,string>();
export const getDiscordAdminRoleId = async (guildId:string)=>{
    if(adminRoles.get(guildId) === undefined){
        const res = await db.selectFrom("AdminRoleId").where("AdminRoleId.GuildId","=",guildId).select("AdminRoleId.RoleId").execute();
        if(res.length === 0){
            return null;
        }
        adminRoles.set(guildId,res[0].RoleId);
    }
    return adminRoles.get(guildId) ;
}
export const setDiscordAdminRoleId = async (guildId:string,adminRoleId:string)=>{

}