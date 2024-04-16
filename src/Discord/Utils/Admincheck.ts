import { administer_role_id } from '../discordPref';
import { SlashCommandBuilder,GuildMemberRoleManager } from 'discord.js';
import { ChatInputCommandInteraction , type CacheType } from 'discord.js';
export const checkAdmin = async (interaction:ChatInputCommandInteraction<CacheType>)=>{
    const administer = interaction.member?.roles;
    const admin_id = administer_role_id;
    if(administer instanceof GuildMemberRoleManager ) {
        const j  = administer.cache.find(r=>r.id==admin_id)
        if(!j){
            await interaction.reply({ content: '관리자가 아닙니다. 이 명령은 관리자만 가능합니다.', ephemeral: true });
            return false;
            }
    } else {
        const j = administer?.find(r=>r==admin_id)
        if(!j){
            await interaction.reply({ content: '관리자가 아닙니다. 이 명령은 관리자만 가능합니다.', ephemeral: true });
            return false;
        }
    }
    return true;
}