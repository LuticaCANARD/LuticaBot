import { db } from "../utils/db/db";
export const getCasinoRoles = async (guildId: string) => { 

    return await db.selectFrom("CasinoRoles")
    .where("CasinoRoles.GuildId","=",guildId)
    .select(["CasinoRoles.RoleName","CasinoRoles.Priority"])
    .orderBy("CasinoRoles.Priority").execute();
}