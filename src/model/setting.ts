import { db } from '../utils/db/db';

export const GetSetting = async (settingname:string) =>{
    return await db.selectFrom("ServerPref")
    .select("value")
	.where("ServerPref.prefKey","=",settingname)
    .execute();
}
